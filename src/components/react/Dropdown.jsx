import React from "react";
import SelectSearch from "react-select-search";
import 'react-select-search/style.css'
import { loadAttendees, fullName, getKey } from "../../lib/attendees.js";
import { url } from "../../lib/url.js";

export default class DropDown extends React.Component {


    constructor() {
        super();
        this.state = {
            selection: "",
            options: []
        }
    }

    componentDidMount() {
        if (!getKey()) {
            window.location.href = url('error/')
            return
        }
        loadAttendees().catch(() => {
            window.location.href = url('error/')
        })
        loadAttendees().then(({ attendees }) => {
            let options = []

            for (let option of attendees) {
                const name = fullName(option)
                const value = name + " " + option.table
                if (!options.find(element => element.value == value)) {
                    options.push({ name, value, table: option.table })
                }
            }
            this.setState({options})
        });
    }
    
    onChange = (selection) => {
        let guest = this.state.options.find(guest => guest.value == selection)
        if (guest !== null) {
            this.setState({selection, info: guest, table: guest.table});
        }
    }

    getButton = () => {
        if (this.state.selection != "") {
            return (
                <div className="flex justify-center mt-10">
                    <div className="inline-flex items-center justify-center gap-2 px-4 py-3 mb-2 text-xs font-semibold leading-loose text-white transition-all bg-red-800 border border-transparent rounded-md hover:ring-2 focus:outline-none focus:ring-2 ring-offset-white focus:ring-red-500 hover:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800">
                        <a href={url("find_table/?") + new URLSearchParams({ name: this.state.info.name, table: this.state.table })}>Find Your Table</a>
                    </div>
                </div>
            );
        }
        return null;
    }

    render() {
        return(
            <div>
                <div>
                    <SelectSearch
                        className="select-search"
                        options={this.state.options}
                        search
                        placeholder="Search by name"
                        value={this.state.selection}
                        onChange={(value) => this.onChange(value)}
                    />
                </div>
                {this.getButton()}
            </div>
        );
    }
}