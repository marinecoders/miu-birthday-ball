"""Generate a fake guest list to build and test the site with.

Writes sample_guest_list.xlsx next to this script, in the same flat layout
that build_guest_list.py reads: one row per guest with Table, Title, First Name, Last Name.

    python make_sample.py
"""

import json
import random
from pathlib import Path

from openpyxl import Workbook
from openpyxl.styles import Font
from openpyxl.worksheet.table import Table, TableStyleInfo

HERE = Path(__file__).parent
FLOOR_PLAN = json.loads((HERE.parent / "src" / "lib" / "floor-plan.json").read_text(encoding="utf-8"))
TABLES = sorted(table["number"] for table in FLOOR_PLAN["tables"])

FIRST = [
    "James", "Maria", "Robert", "Ashley", "Michael", "Jessica", "David", "Sarah",
    "Daniel", "Emily", "Christopher", "Amanda", "Matthew", "Lauren", "Anthony",
    "Megan", "Joshua", "Rachel", "Andrew", "Nicole", "Tyler", "Brianna", "Kevin",
    "Olivia", "Brandon", "Sofia", "Justin", "Hannah", "Marcus", "Grace", "Luis",
    "Chloe", "Ethan", "Natalie", "Jordan", "Alyssa", "Caleb", "Vanessa", "Isaiah",
    "Kayla", "Derek", "Monique", "Trevor", "Jasmine", "Owen", "Elena", "Samuel",
    "Priya", "Nathan", "Tamika",
]
LAST = [
    "Alvarez", "Brooks", "Castillo", "Dawson", "Ellison", "Fischer", "Gallagher",
    "Harper", "Ibarra", "Jennings", "Kowalski", "Lambert", "Mendoza", "Nakamura",
    "O'Neill", "Patel", "Quinn", "Ramirez", "Sullivan", "Thornton", "Underwood",
    "Vasquez", "Whitaker", "Xiong", "Yates", "Zimmerman", "Abbott", "Bishop",
    "Chen", "Delgado", "Everett", "Ferreira", "Grant", "Holloway", "Iverson",
    "Jacobs", "Keller", "Lopez", "McAllister", "Novak", "Okafor", "Prescott",
    "Reyes", "Stanton", "Tran", "Vaughn", "Washington", "Young", "Barnes", "Cruz",
]
MARINE = ["Gen", "LtGen", "MajGen", "BGen", "Col", "LtCol", "Maj", "Capt", "1stLt",
          "SgtMaj", "MGySgt", "1stSgt", "MSgt", "GySgt", "SSgt", "Sgt", "Cpl", "LCpl"]
CIVILIAN = ["Mr.", "Ms.", "Mrs.", "Dr."]


def main() -> None:
    rng = random.Random(251)  # fixed seed, so the list is the same every run
    rows, used = [], set()

    def name(last=None):
        while True:  # keep names unique so the only duplicate is the deliberate one below
            pick = (rng.choice(FIRST), last or rng.choice(LAST))
            if pick not in used:
                used.add(pick)
                return pick

    for table in TABLES:
        seats = rng.randint(6, 10)
        while seats > 0:
            first, last = name()
            rows.append((table, rng.choice(MARINE), first, last))
            seats -= 1
            if seats > 0 and rng.random() < 0.5:  # bring a guest
                rows.append((table, rng.choice(CIVILIAN), *name(last)))
                seats -= 1

    # A few cases worth testing: same name at two tables, no title, long name.
    rows.append((TABLES[2], "Sgt", "John", "Smith"))
    rows.append((TABLES[-3], "Mr.", "John", "Smith"))
    rows.append((TABLES[-2], "", "Taylor", "Morgan"))
    rows.append((TABLES[-1], "Mrs.", "Alexandra-Catherine", "Montgomery-Fitzgerald"))
    rows.sort(key=lambda r: (r[0], r[3], r[2]))

    wb = Workbook()
    ws = wb.active
    ws.title = "Guests"
    ws.append(["Table", "Title", "First Name", "Last Name"])
    for row in rows:
        ws.append(row)
    for cell in ws[1]:
        cell.font = Font(bold=True)
    for col, width in zip("ABCD", (8, 10, 22, 26)):
        ws.column_dimensions[col].width = width
    ws.freeze_panes = "A2"
    table = Table(displayName="Guests", ref=f"A1:D{len(rows) + 1}")
    table.tableStyleInfo = TableStyleInfo(name="TableStyleMedium2", showRowStripes=True)
    ws.add_table(table)

    out = HERE / "sample_guest_list.xlsx"
    wb.save(out)
    print(f"Wrote {len(rows)} fake guests at {len(TABLES)} tables to {out}")


if __name__ == "__main__":
    main()
