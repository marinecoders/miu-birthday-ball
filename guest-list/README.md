# Guest list

The site reads an **encrypted** guest list from `public/attendees.enc.json`. The key is part of the QR code link, so only people with the QR code can read the list. The real spreadsheet and the key never go in git.

## Spreadsheet layout

First sheet, one row per guest, with this header row:

| Table | Title | First Name | Last Name |
|-------|-------|------------|-----------|
| 1     | Col   | Jane       | Doe       |

`sample_guest_list.xlsx` is a fake 416-guest list in this layout, made by `make_sample.py`.

## Update the guest list

```bash
pip install openpyxl cryptography
python guest-list/build_guest_list.py path/to/seating_chart.xlsx
```

This writes `public/attendees.enc.json` and prints the QR code link (`https://marinecoders.github.io/miu-birthday-ball/#k=...`). Then commit and push `public/attendees.enc.json` to publish.

It also lists problems to check: rows with no name, table numbers that aren't numbers or aren't on the floor map (1-50), and names that appear more than once.

## Make the QR codes (one per door)

```bash
pip install segno
python guest-list/make_qr_code.py
```

Each ballroom door gets its own QR code. It carries the key plus that door's number (`#k=...&d=2`), so the floor map shows "You are here" at the door the guest walked in. The script writes:

- `qr-code-door-N.svg` (best for printing) and `qr-code-door-N.png`, for each door
- `qr-codes-print.html`: one labeled sign per door, one per page. Open it in a browser and print.

All are git-ignored because the codes contain the key. They only depend on the key and door numbers, so they keep working when you update the guest list. Print each at least 2 inches (5 cm) wide, post it at **its own door**, and test-scan it there.

### Doors

The doors are listed in `src/lib/doors.json`: each door's name (printed on its sign) and where its pin goes on the floor map. The map is a grid 360 wide by 198 tall, with (0, 0) at the top-left. `label` says where the "You are here" tag sits: `above`, `below`, `left`, or `right` of the pin. After changing door names or adding a door, run `make_qr_code.py` again. Moving a pin only needs a commit and push.

## The key

- Created on the first run and saved in `guest-list/.key`. It is ignored by git. **Don't commit it, and back it up somewhere safe**, like a password manager.
- Later runs reuse it, so seating changes don't break printed QR codes.
- If you lose it, or it leaks, run with `--new-key`. That makes new QR codes necessary, because the old ones stop working.
- Anyone else who updates the list needs a copy of `.key`.

Spreadsheets (`*.xlsx`, `*.csv`) in this folder are ignored by git, except the sample, so the real seating chart can sit here safely.
