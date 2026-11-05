"""Make the QR codes guests scan: one per ballroom door, and one for the tables.

    python guest-list/make_qr_code.py

Each door's code opens the site with the guest list key and that door's
number (#k=KEY&d=N), so the floor map puts "You are here" at the right door.
Doors, their names, and map positions are in src/lib/doors.json.

Writes these files next to this script (all git-ignored, because the codes
contain the key):
    qr-code-door-N.svg   vector, best for printing at any size
    qr-code-door-N.png   for documents and slides
    qr-codes-print.html  one labeled sign per door, ready to print
    qr-code-info.svg/png the table code: opens the Information page with the key
    qr-code-info-print.html  the table sign (print one per table)

The codes only depend on the key and door numbers, so they stay valid when
the guest list changes. Run build_guest_list.py first if guest-list/.key
doesn't exist yet.
"""

import html
import json
import sys
from pathlib import Path

import segno

from build_guest_list import KEY_FILE, SITE

HERE = Path(__file__).parent
DOORS_FILE = HERE.parent / "src" / "lib" / "doors.json"
EVENT_TITLE = "251st Marine Corps Birthday Ball"


def door_link(key: str, door: str) -> str:
    return f"{SITE}/#k={key}&d={door}"


def info_link(key: str) -> str:
    return f"{SITE}/info/#k={key}"


def door_sign(door: str, name: str, svg: str) -> dict:
    return {"heading": "Find your seat", "svg": svg, "label": name,
            "check": f"This code is for {name} only. Post it at that location."}


def print_sheet(signs: list[dict]) -> str:
    """One page per sign: event title, heading, instructions, QR code, label."""
    pages = "\n".join(
        f"""  <section class="sign">
    <p class="event">{html.escape(EVENT_TITLE)}</p>
    <h1>{html.escape(sign["heading"])}</h1>
    <p class="how">Point your phone's camera at the code</p>
    <div class="qr">{sign["svg"]}</div>
    <p class="door">{html.escape(sign["label"])}</p>
    <p class="check">{html.escape(sign["check"])}</p>
  </section>"""
        for sign in signs
    )
    return f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>QR code signs - {html.escape(EVENT_TITLE)}</title>
<style>
  @page {{ size: letter portrait; margin: 0.6in; }}
  body {{ margin: 0; font-family: Georgia, "Times New Roman", serif; color: #111; }}
  .sign {{ min-height: 9.6in; display: flex; flex-direction: column; align-items: center;
          justify-content: center; text-align: center; page-break-after: always; break-after: page; }}
  .sign:last-child {{ page-break-after: auto; break-after: auto; }}
  .event {{ font: 600 14pt Arial, sans-serif; letter-spacing: 0.18em; text-transform: uppercase; color: #8E0A24; margin: 0; }}
  h1 {{ font-size: 40pt; margin: 0.15in 0 0.05in; }}
  .how {{ font: 14pt Arial, sans-serif; margin: 0 0 0.3in; }}
  .qr svg {{ width: 5in; height: 5in; }}
  .door {{ font: 700 22pt Arial, sans-serif; margin: 0.25in 0 0.05in; }}
  .check {{ font: 10pt Arial, sans-serif; color: #666; margin: 0; }}
  @media screen {{ .sign {{ border-bottom: 2px dashed #ccc; padding: 0.5in 0; }} }}
</style>
</head>
<body>
{pages}
</body>
</html>
"""


def main() -> None:
    if not KEY_FILE.exists():
        sys.exit(f"No key at {KEY_FILE}. Run build_guest_list.py on a spreadsheet first.")
    key = KEY_FILE.read_text().strip()
    doors = json.loads(DOORS_FILE.read_text(encoding="utf-8"))["doors"]

    signs = []
    print(f"QR codes for {len(doors)} doors:")
    for door, info in doors.items():
        # "Q" error correction still scans with about 25% of the code smudged or covered.
        qr = segno.make(door_link(key, door), error="q", micro=False)
        svg, png = HERE / f"qr-code-door-{door}.svg", HERE / f"qr-code-door-{door}.png"
        qr.save(svg, scale=10, border=4, dark="#000000", light="#ffffff")
        qr.save(png, scale=20, border=4, dark="#000000", light="#ffffff")
        signs.append(door_sign(door, info["name"], qr.svg_inline(scale=10, border=4, dark="#000000", light="#ffffff")))
        print(f"  {info['name']}: {svg.name}, {png.name}")

    sheet = HERE / "qr-codes-print.html"
    sheet.write_text(print_sheet(signs), encoding="utf-8")
    print(f"\nPrint sheet, one sign per page: {sheet}")
    print("Open it in a browser and print. Test-scan each printed sign at its own door.")

    # The table code: the Information page, with the key so honored guests and
    # ceremony participants show. No entry number, so no "You are here".
    qr = segno.make(info_link(key), error="q", micro=False)
    svg, png = HERE / "qr-code-info.svg", HERE / "qr-code-info.png"
    qr.save(svg, scale=10, border=4, dark="#000000", light="#ffffff")
    qr.save(png, scale=20, border=4, dark="#000000", light="#ffffff")
    table_sheet = HERE / "qr-code-info-print.html"
    table_sheet.write_text(print_sheet([{
        "heading": "Tonight's program",
        "svg": qr.svg_inline(scale=10, border=4, dark="#000000", light="#ffffff"),
        "label": "Schedule, map, restrooms, bars & more",
        "check": "Table card. Print one for each table.",
    }]), encoding="utf-8")
    print(f"\nTable code (Information page): {svg.name}, {png.name}")
    print(f"Table sign: {table_sheet}  (print one per table)")


if __name__ == "__main__":
    main()
