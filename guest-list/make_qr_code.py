"""Make the QR code guests scan, from the key in guest-list/.key.

    python guest-list/make_qr_code.py

Writes two files next to this script (both git-ignored, because the code
contains the key):
    qr-code.svg  vector, best for printing at any size
    qr-code.png  for documents and slides

The code only depends on the key, so it stays valid when the guest list
changes. Run build_guest_list.py first if guest-list/.key doesn't exist yet.
"""

import sys
from pathlib import Path

import segno

from build_guest_list import KEY_FILE, SITE

HERE = Path(__file__).parent


def main() -> None:
    if not KEY_FILE.exists():
        sys.exit(f"No key at {KEY_FILE}. Run build_guest_list.py on a spreadsheet first.")
    link = f"{SITE}/#k={KEY_FILE.read_text().strip()}"

    # "Q" error correction still scans with about 25% of the code smudged or covered.
    qr = segno.make(link, error="q", micro=False)
    svg, png = HERE / "qr-code.svg", HERE / "qr-code.png"
    qr.save(svg, scale=10, border=4, dark="#000000", light="#ffffff")
    qr.save(png, scale=20, border=4, dark="#000000", light="#ffffff")

    print(f"QR code (version {qr.version}, {qr.symbol_size(border=0)[0]} squares across):")
    print(f"  {svg}")
    print(f"  {png}")
    print("Print it at least 2 inches (5 cm) wide, and test-scan the printout before the ball.")


if __name__ == "__main__":
    main()
