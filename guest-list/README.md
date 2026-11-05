# Guest list

The site reads an **encrypted** guest list from `public/attendees.enc.json`. The key is part of the QR code link, so only people with the QR code can read the list. The real spreadsheet and the key never go in git.

## Spreadsheet layout

First sheet, one row per guest, with this header row:

| Table | Title | First Name | Last Name |
|-------|-------|------------|-----------|
| 1     | Col   | Jane       | Doe       |

`make_sample.py` generates a fake guest list for tables 1–22 in this layout, saved as `sample_guest_list.xlsx`. Regenerate it after a layout change with `python guest-list/make_sample.py`.

## Update the guest list

```bash
pip install openpyxl cryptography
python guest-list/build_guest_list.py path/to/seating_chart.xlsx
```

This writes `public/attendees.enc.json` and prints the QR code link (`https://marinecoders.github.io/miu-birthday-ball/#k=...`). Then commit and push `public/attendees.enc.json` to publish.

It also lists problems to check: rows with no name, table numbers that aren't numbers or aren't on the floor map (1–22), and names that appear more than once.

The map has **22 guest tables in staggered rows**, numbered left to right and front
to back, with three tables to the left of the ceremony aisle and four to the right
in each of the three main rows, plus Table 22 below Table 17 in the left block.
The front row wraps around the ceremony area; the full aisle from
that area to the back wall stays free of tables. The rear row is pulled forward
to leave extra space around the separate, unnumbered circular **POW/MIA table just right of
Entry 2**. There are no VIP designations. Use **table numbers 1–22**
in your seating spreadsheet; existing guest assignments are not automatically
renumbered. Reassign any guests at removed tables 23–34 and rebuild the encrypted
guest list before publishing the new layout.
The map, validator, and sample generator share `src/lib/floor-plan.json`.
Restrooms are marked outside the right-hand wall, with a dashed guide from the
lower-right foyer. Their icon and guide coordinates are in the `restrooms` field
of the floor plan; **Whole room** shows the complete guide.

## Make the QR codes (one per location)

```bash
pip install segno
python guest-list/make_qr_code.py
```

Each ballroom door gets its own QR code. It carries the key plus that door's number (`#k=...&d=2`), so the floor map shows "You are here" at the door the guest walked in. Once they select their table, a blue path leads through that entry to the table, using right-angle turns and leaving clearance around tables and fixed obstacles. Entries 1–4 run right to left. **Location 5 (Main poster)** sits in the middle of the foyer between Entries 2 and 3; its `d=5` code can route through any of the four entries. **Location 6 (Right-side poster)** sits just outside the ballroom's lower-right corner at `(353, 211)`; its `d=6` code goes down around the corner, then across the foyer to any of the four entries. Both posters choose the entry with the shortest clear indoor path to the destination table. Equal indoor distances are resolved by the shorter total walk from the poster, then fewer turns. Existing printed QR codes work without regeneration. Run the script to generate signs for new locations. The script writes:

- `qr-code-door-N.svg` (best for printing) and `qr-code-door-N.png`, for each door
- `qr-codes-print.html`: one labeled sign per door, one per page. Open it in a browser and print.

All are git-ignored because the codes contain the key. They only depend on the key and location numbers, so they keep working when you update the guest list. Print each at least 2 inches (5 cm) wide, post it at **its own location**, and test-scan it there.

### Doors

The QR locations are listed in `src/lib/doors.json`: each location's name (printed on its sign) and where its pin goes on the floor map. The map is a grid 385 wide by 304 tall, with (0, 0) at the top-left. All pins use integer coordinates. Door pins sit directly below their doorway. A poster location supplies `via` points directly below its allowed doorways; its route travels vertically to their shared foyer lane, across to the chosen doorway, then into the ballroom. Keep those approach segments clear of walls and furniture when moving a location. `label` says where the "You are here" tag sits: `above`, `below`, `left`, or `right` of the pin; active routes place the tag below to keep the doorway visible. After changing names or adding a location, run `make_qr_code.py` again. Moving a pin only needs a commit and push.

For a direct map link, use `table_map/?table=1&d=4` (under the site's base URL), or `table_map/?table=1&d=5` for the Main poster. Both `?d=N` and the printed QR fragment `#k=...&d=N` work; the location is remembered between pages and replaced by a new scan. Without a known location, the map asks the guest to scan their entry's QR code instead of guessing a route. Phones default to **Fit route**, showing the entire path, entry marker, and selected table without sideways scrolling. **Whole room** restores the overview and **My table** zooms in on the destination. Zoom is capped at **1.6×** overview for routes and **2×** for table close-ups, with the previous desktop limits retained; longer routes zoom farther out as needed. The routing bounds and fixed obstacles live alongside the tables in `src/lib/floor-plan.json`; update them when the room layout changes. Run `npm test` to check all 132 location/table routes for right-angle turns and obstacle clearance, plus route fitting and zoom limits at phone sizes.

## The key

- Created on the first run and saved in `guest-list/.key`. It is ignored by git. **Don't commit it, and back it up somewhere safe**, like a password manager.
- Later runs reuse it, so seating changes don't break printed QR codes.
- If you lose it, or it leaks, run with `--new-key`. That makes new QR codes necessary, because the old ones stop working.
- Anyone else who updates the list needs a copy of `.key`.

Spreadsheets (`*.xlsx`, `*.csv`) in this folder are ignored by git, except the sample, so the real seating chart can sit here safely.

## The ball's seating chart

`build_guest_list.py` also reads the ball's seating chart (`MIU_Birthday_Ball_Seating_Chart.xlsx`, "Seating Roster" sheet: Table, Seat, Guest Name, Rank, Meal). Only table, seat, title, name, and meal are encrypted; buyer, detachment, seating requests, and ticket numbers never leave your computer. "Other" ranks (civilians) show no title.

```bash
python guest-list/build_guest_list.py guest-list/MIU_Birthday_Ball_Seating_Chart.xlsx
```

## Information page (table QR code)

The QR code on each table opens the Information page (`/info/`): map with restrooms, bars, program, honored guests, ceremony participants, and the Commandant's message.

- General information is public. The **people** (guest of honor, oldest and youngest Marine, ceremony participants) come from `guest-list/event_people.json`, which stays on your computer (git-ignored). `build_guest_list.py` encrypts it into `public/event.enc.json` with the same key, so they only show for people who scan the table code.
- `make_qr_code.py` writes the table code as `qr-code-info.svg/png` and a printable table sign, `qr-code-info-print.html` (print one per table).
- The "Good to know" cards (bars, restrooms, ...) are in `src/lib/info.js`.
