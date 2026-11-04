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

This writes `public/attendees.enc.json` and prints the QR code link (`https://birthday.marines.dev/#k=...`). Then commit and push `public/attendees.enc.json` to publish.

It also lists problems to check: rows with no name, table numbers that aren't numbers or aren't on the floor map (1-50), and names that appear more than once.

## The key

- Created on the first run and saved in `guest-list/.key`. It is ignored by git. **Don't commit it, and back it up somewhere safe**, like a password manager.
- Later runs reuse it, so seating changes don't break printed QR codes.
- If you lose it, or it leaks, run with `--new-key`. That makes new QR codes necessary, because the old ones stop working.
- Anyone else who updates the list needs a copy of `.key`.

Spreadsheets (`*.xlsx`, `*.csv`) in this folder are ignored by git, except the sample, so the real seating chart can sit here safely.
