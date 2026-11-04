"""Encrypt a guest list spreadsheet into public/attendees.enc.json, which the site reads.

The spreadsheet needs a header row with these columns (any order, any case):
    Table | Title | First Name | Last Name
Works with .xlsx (first sheet) or .csv.

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
KEY_FILE = HERE / ".key"
SITE = "https://birthday.marines.dev"
MAP_TABLES = set(range(1, 51))  # tables drawn on the floor map
COLUMNS = {"table": "table", "title": "title", "first name": "first_name", "last name": "last_name"}


def b64url(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).rstrip(b"=").decode()


def unb64url(text: str) -> bytes:
    return base64.urlsafe_b64decode(text + "=" * (-len(text) % 4))


def read_rows(path: Path) -> list[list]:
    if path.suffix.lower() == ".csv":
        with path.open(newline="", encoding="utf-8-sig") as f:
            return list(csv.reader(f))
    from openpyxl import load_workbook
    ws = load_workbook(path, read_only=True, data_only=True).worksheets[0]
    return [list(r) for r in ws.iter_rows(values_only=True)]


def clean(value) -> str:
    if value is None:
        return ""
    if isinstance(value, float) and value.is_integer():
        value = int(value)
    return str(value).strip()


def parse_guests(path: Path) -> tuple[list[dict], list[str]]:
    rows = read_rows(path)
    header = [clean(h).lower() for h in rows[0]]
    missing = [name for name in COLUMNS if name not in header]
    if missing:
        sys.exit(f"Header row is missing column(s): {', '.join(missing)}. Found: {header}")
    index = {key: header.index(name) for name, key in COLUMNS.items()}

    guests, problems = [], []
    for line, row in enumerate(rows[1:], start=2):
        guest = {key: clean(row[col]) if col < len(row) else "" for key, col in index.items()}
        if not any(guest.values()):
            continue  # blank row
        if not guest["first_name"] and not guest["last_name"]:
            problems.append(f"row {line}: no name")
            continue
        if not guest["table"].isdigit():
            problems.append(f"row {line}: {guest['first_name']} {guest['last_name']} has table '{guest['table']}'")
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

    iv = os.urandom(12)
    plaintext = json.dumps(guests, separators=(",", ":")).encode()
    ciphertext = AESGCM(key).encrypt(iv, plaintext, None)  # AES-256-GCM, tag appended (what WebCrypto expects)
    OUT.write_text(json.dumps({"v": 1, "iv": b64url(iv), "data": b64url(ciphertext)}), encoding="utf-8")

    print(f"Encrypted {len(guests)} guests at {len({g['table'] for g in guests})} tables into {OUT}")
    print(f"\nQR code link:\n  {SITE}/#k={b64url(key)}")
    print(f"Testing on this computer:\n  http://localhost:4321/#k={b64url(key)}")
    if problems:
        print(f"\n{len(problems)} thing(s) to check:")
        for p in problems:
            print("  -", p)


if __name__ == "__main__":
    main()
