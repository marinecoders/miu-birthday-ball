from dataclasses import dataclass, asdict
from itertools import product
import json
import openpyxl


@dataclass
class Attendee:
    first_name: str
    last_name: str
    table: int


wb_obj = openpyxl.load_workbook("seating_chart.xlsx")
wb_obj.active = 2
sheet_obj = wb_obj.active


def get_attendees(table_start_row: int, table_start_col: int) -> list[Attendee]:
    table_end_row = table_start_row + 15
    table_end_col = table_start_col + 6

    attendees: list[Attendee] = []
    attendee = None
    curr_table = None

    for row in range(table_start_row, table_end_row):
        for col in range(table_start_col, table_end_col):
            cell_val = sheet_obj.cell(row=row, column=col).value

            # Get the table number
            if cell_val and row == table_start_row and col == table_start_col:
                curr_table = int(cell_val.split()[1])
                continue

            # Skip empty cells and headers
            if not cell_val or row <= table_start_row + 1 or col == table_start_col:
                continue

            # Process first names
            if col == table_start_col + 1:
                first_name = cell_val
                attendee = Attendee(
                    first_name=first_name, last_name="", table=curr_table
                )

            # Process last names and add attendees to the list
            elif col == table_start_col + 2:
                last_name = cell_val
                if attendee:
                    attendee.last_name = last_name
                    attendees.append(attendee)
    return attendees


start_rows = range(1, 186, 17)
start_cols = range(1, 20, 7)
table_start_positions = product(start_rows, start_cols)

all_attendees: list[Attendee] = []
for start_position in table_start_positions:
    start_row, start_col = start_position
    table_attendees = get_attendees(start_row, start_col)

    if table_attendees:
        all_attendees.extend(table_attendees)

with open("attendees.json", "w") as json_file:
    json_friendly_list = [asdict(attendee) for attendee in all_attendees]
    json.dump(json_friendly_list, json_file)
