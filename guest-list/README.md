# Guest list

The site reads an **encrypted** guest list from `public/attendees.enc.json`. The key is part of the QR code link, so only people with the QR code can read the list. The real spreadsheet and the key never go in git.

## Spreadsheet layout

First sheet, one row per guest, with this header row:

| Table | Title | First Name | Last Name |
|-------|-------|------------|-----------|
| 1     | Col   | Jane       | Doe       |

`sample_guest_list.xlsx` is a fake guest list for tables 1–34 in this layout, made by `make_sample.py`.

## Update the guest list

```bash
pip install openpyxl cryptography
python guest-list/build_guest_list.py path/to/seating_chart.xlsx
```

This writes `public/attendees.enc.json` and prints the QR code link (`https://marinecoders.github.io/miu-birthday-ball/#k=...`). Then commit and push `public/attendees.enc.json` to publish.

It also lists problems to check: rows with no name, table numbers that aren't numbers or aren't on the floor map (1–34), and names that appear more than once.

The map follows the venue reference plan with its original tables 1–7 removed.
Original table 8 is now table 1, original table 9 is now table 2, and so on through
original table 41, now table 34. Use the **new numbers 1–34** in your seating
spreadsheet; existing guest assignments are not automatically renumbered.
The map, validator, and sample generator share `src/lib/floor-plan.json`.

## Make the QR code

```bash
pip install segno
python guest-list/make_qr_code.py
```

This writes `guest-list/qr-code.svg` (best for printing) and `guest-list/qr-code.png`. Both are git-ignored because the code contains the key. The QR code only depends on the key, so it keeps working when you update the guest list. Print it at least 2 inches (5 cm) wide and test-scan the printout.

## The key

- Created on the first run and saved in `guest-list/.key`. It is ignored by git. **Don't commit it, and back it up somewhere safe**, like a password manager.
- Later runs reuse it, so seating changes don't break printed QR codes.
- If you lose it, or it leaks, run with `--new-key`. That makes new QR codes necessary, because the old ones stop working.
- Anyone else who updates the list needs a copy of `.key`.

Spreadsheets (`*.xlsx`, `*.csv`) in this folder are ignored by git, except the sample, so the real seating chart can sit here safely.
