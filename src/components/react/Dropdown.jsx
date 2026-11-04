import React from "react";
import SelectSearch from "react-select-search";
import 'react-select-search/style.css'
import { loadAttendees, fullName, getKey } from "../../lib/attendees.js";
import { url } from "../../lib/url.js";
import { BUTTON_PRIMARY } from "../../lib/ui.js";

export default class DropDown extends React.Component {

    constructor() {
        super();
        this.state = {
            selection: "",
            options: [],
            loading: true
        }
    }

    componentDidMount() {
        if (!getKey()) {
            window.location.href = url('error/')
            return
        }
        loadAttendees().then(({ attendees }) => {
            let options = []
            const sorted = [...attendees].sort((a, b) =>
                (a.last_name + a.first_name).localeCompare(b.last_name + b.first_name))

            for (let option of sorted) {
                const name = fullName(option)
                const value = name + " " + option.table
                if (!options.find(element => element.value == value)) {
                    options.push({ name, value, table: option.table })
                }
            }
            this.setState({ options, loading: false })
        }).catch(() => {
            window.location.href = url('error/')
        });
    }

    onChange = (selection) => {
        let guest = this.state.options.find(guest => guest.value == selection)
        if (guest) {
            this.setState({selection, info: guest, table: guest.table});
        }
    }

    getButton = () => {
        if (this.state.selection == "") return null;
        const href = url("find_table/?") + new URLSearchParams({ name: this.state.info.name, table: this.state.table })
        return (
            <a href={href} className={BUTTON_PRIMARY + " mt-5 w-full"}>
                Find my table
                <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.64l-4.22-4.22a.75.75 0 1 1 1.06-1.06l5.5 5.5a.75.75 0 0 1 0 1.06l-5.5 5.5a.75.75 0 1 1-1.06-1.06l4.22-4.22H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" />
                </svg>
            </a>
        );
    }

    render() {
        return(
            <div>
                <div className="relative">
                    <svg aria-hidden="true" className="search-icon h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.45 4.39l3.08 3.08a.75.75 0 1 1-1.06 1.06l-3.08-3.08A7 7 0 0 1 2 9Z" clipRule="evenodd" />
                    </svg>
                    <SelectSearch
                        id="guest-search"
                        className="select-search"
                        options={this.state.options}
                        search
                        disabled={this.state.loading}
                        placeholder={this.state.loading ? "Loading guest list…" : "Start typing your name"}
                        emptyMessage="No guest by that name. Try your last name."
                        value={this.state.selection}
                        onChange={(value) => this.onChange(value)}
                    />
                </div>
                {this.getButton()}
            </div>
        );
    }
}
