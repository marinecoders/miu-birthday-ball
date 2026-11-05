"""Encrypt a guest list spreadsheet into public/attendees.enc.json, which the site reads.

Two layouts work (header row, any column order, any case):
    Table | Title | First Name | Last Name            (the sample list)
    Table | Seat | Guest Name | Rank | Meal           (the ball's seating chart)
Seat and Meal are optional in either. For .xlsx, the "Seating Roster" sheet is
used if there is one, otherwise the first sheet. .csv works too.

Only what guests see goes into the encrypted file: table, seat, title, name,
and meal. Buyer, detachment, seating requests, and ticket numbers stay out.

    python build_guest_list.py seating_chart.xlsx

The key is created the first time and saved in guest-list/.key (never commit it).
Later runs reuse it, so printed QR codes keep working after seating changes.
Pass --new-key to replace it; every QR code made with the old key stops working.
"""

import argparse
import base64
import csv
import json
import os
import sys
from collections import Counter
from pathlib import Path

from cryptography.hazmat.primitives.ciphers.aead import AESGCM

HERE = Path(__file__).parent
OUT = HERE.parent / "public" / "attendees.enc.json"
# Information-page people (guest of honor, oldest/youngest Marine, ceremony
# participants): kept on this computer, published only encrypted.
PEOPLE_IN = HERE / "event_people.json"
PEOPLE_OUT = HERE.parent / "public" / "event.enc.json"
KEY_FILE = HERE / ".key"
SITE = "https://marinecoders.github.io/miu-birthday-ball"  # change if you add a custom domain
FLOOR_PLAN = json.loads((HERE.parent / "src" / "lib" / "floor-plan.json").read_text(encoding="utf-8"))
MAP_TABLES = {table["number"] for table in FLOOR_PLAN["tables"]}
ROSTER_SHEET = "Seating Roster"
# Header names each field can have (lowercase).
HEADERS = {
    "table": ["table"],
    "seat": ["seat"],
    "title": ["title", "rank"],
    "first_name": ["first name"],
    "last_name": ["last name"],
    "name": ["guest name", "name"],
    "meal": ["meal", "menu", "entree", "meal selection"],
}
NO_TITLE = {"other", "none", "n/a", "-"}  # civilians are "Other" in the chart


def b64url(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).rstrip(b"=").decode()


def unb64url(text: str) -> bytes:
    return base64.urlsafe_b64decode(text + "=" * (-len(text) % 4))


def read_rows(path: Path) -> list[list]:
    if path.suffix.lower() == ".csv":
        with path.open(newline="", encoding="utf-8-sig") as f:
            return list(csv.reader(f))
    from openpyxl import load_workbook
    wb = load_workbook(path, read_only=True, data_only=True)
    ws = wb[ROSTER_SHEET] if ROSTER_SHEET in wb.sheetnames else wb.worksheets[0]
    return [list(r) for r in ws.iter_rows(values_only=True)]


def clean(value) -> str:
    if value is None:
        return ""
    if isinstance(value, float) and value.is_integer():
        value = int(value)
    return " ".join(str(value).split())  # trims and collapses doubled spaces


def clean_meal(meal: str) -> str:
    # "Guest - Children's Meal (TBD)" -> "Children's Meal (TBD)"
    return meal.removeprefix("Guest - ").strip()


def parse_guests(path: Path) -> tuple[list[dict], list[str]]:
    rows = read_rows(path)
    header = [clean(h).lower() for h in rows[0]]
    col = {field: next((header.index(h) for h in names if h in header), None) for field, names in HEADERS.items()}
    has_split_name = col["first_name"] is not None and col["last_name"] is not None
    if col["table"] is None or not (has_split_name or col["name"] is not None):
        sys.exit("Header row needs Table plus either First Name and Last Name, or Guest Name. "
                 f"Found: {header}")
    get = lambda row, field: clean(row[col[field]]) if col[field] is not None and col[field] < len(row) else ""

    guests, problems = [], []
    for line, row in enumerate(rows[1:], start=2):
        if not any(clean(v) for v in row):
            continue  # blank row
        if has_split_name:
            first, last = get(row, "first_name"), get(row, "last_name")
        else:
            first, _, last = get(row, "name").partition(" ")
        title = get(row, "title")
        guest = {"table": get(row, "table"), "title": "" if title.lower() in NO_TITLE else title,
                 "first_name": first, "last_name": last}
        if get(row, "seat"):
            guest["seat"] = get(row, "seat")
        if get(row, "meal"):
            guest["meal"] = clean_meal(get(row, "meal"))
        if not first and not last:
            problems.append(f"row {line}: no name")
            continue
        if not guest["table"].isdigit():
            problems.append(f"row {line}: {first} {last} has table '{guest['table']}'")
            continue
        if int(guest["table"]) not in MAP_TABLES:
            problems.append(f"row {line}: table {guest['table']} is not on the floor map")
        guests.append(guest)

    names = lambda g: (g["first_name"].lower(), g["last_name"].lower())
    for (first, last), n in Counter(map(names, guests)).items():
        if n > 1:
            tables = sorted({g["table"] for g in guests if names(g) == (first, last)}, key=int)
            problems.append(f"{first.title()} {last.title()} appears {n} times (tables {', '.join(tables)})")
    return guests, problems


def encrypt_to(path: Path, data, key: bytes) -> None:
    iv = os.urandom(12)
    plaintext = json.dumps(data, separators=(",", ":")).encode()
    ciphertext = AESGCM(key).encrypt(iv, plaintext, None)  # AES-256-GCM, tag appended (what WebCrypto expects)
    path.write_text(json.dumps({"v": 1, "iv": b64url(iv), "data": b64url(ciphertext)}), encoding="utf-8")


def load_key(new: bool) -> bytes:
    if KEY_FILE.exists() and not new:
        return unb64url(KEY_FILE.read_text().strip())
    key = AESGCM.generate_key(bit_length=256)
    KEY_FILE.write_text(b64url(key))
    print(f"Created a new key in {KEY_FILE}. Keep it safe and out of git.\n")
    return key


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("spreadsheet", type=Path)
    parser.add_argument("--new-key", action="store_true", help="replace the key (old QR codes stop working)")
    args = parser.parse_args()

    guests, problems = parse_guests(args.spreadsheet)
    key = load_key(args.new_key)

    encrypt_to(OUT, guests, key)
    if PEOPLE_IN.exists():
        people = json.loads(PEOPLE_IN.read_text(encoding="utf-8"))
        people.pop("_help", None)
        encrypt_to(PEOPLE_OUT, people, key)
        print(f"Encrypted the Information page's people from {PEOPLE_IN.name} into {PEOPLE_OUT}")

    print(f"Encrypted {len(guests)} guests at {len({g['table'] for g in guests})} tables into {OUT}")
    meals = Counter(g["meal"] for g in guests if g.get("meal"))
    if meals:
        print("Meals: " + ", ".join(f"{m} {n}" for m, n in meals.most_common()))
    print(f"\nQR code link:\n  {SITE}/#k={b64url(key)}")
    print(f"Testing on this computer:\n  http://localhost:4321/miu-birthday-ball/#k={b64url(key)}")
    if problems:
        print(f"\n{len(problems)} thing(s) to check:")
        for p in problems:
            print("  -", p)


if __name__ == "__main__":
    main()
