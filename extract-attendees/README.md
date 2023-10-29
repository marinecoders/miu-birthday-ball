# Extract Attendees from MIU Ball Chart XLSX
In case I get hit by a bus tomorrow, this will pull the attendees out of the xlsx and put them in a .json file that'll look like:

```json
[
    {
        "first_name": "Bobby",
        "last_name": "Orr",
        "table": 13
    },
    {
        "first_name": "Larry",
        "last_name": "Bird",
        "table": 13
    },
]
```

# Install/Use
- Put the seating chart file in the same directory as the script, and name it "seating_chart.xlsx"
- `pip install -r requirements.txt` (install the library to handle xlsx files)
- `python3 extract.py`
- You'll get an `attendees.json` file in the same directory as the script

# Caveats
- It's not complete, it only pulls from the sheet with the big list of tables, not the sheet with the VIPs. I'll get that updated tomorrow
- Seems like it works? Could probably use some spot checks beyond what I did....