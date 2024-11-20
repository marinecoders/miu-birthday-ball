import React from "react";
import SelectSearch from "react-select-search";
import 'react-select-search/style.css'

export default class DropDown extends React.Component {


    constructor() {
        super();
        this.state = {
            selection: "",
            options: []
        }
    }

    componentDidMount() {
        let queryString = window.location.search;
        let urlParams = new URLSearchParams(queryString);
        if (!urlParams.get('key') || urlParams.get('key') == "") {
            window.location.href = '/error'
        }
        // TODO READ IN JSON         
        fetch("https://faas-nyc1-2ef2e6cc.doserverless.co/api/v1/web/fn-bd167a67-9585-47aa-8ecf-973709cdf3c0/default/birthday-response?key=" + urlParams.get('key'), {
            method: "GET",
            mode: "cors", // no-cors, *cors, same-origin
            cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
            headers: {
                "Content-Type": "application/json",
            },
            rejectUnauthorized: false,
        }).then((response) => response.json()).then((data) => {
            let options = []

            for (let option of data) {
                if (!options.find(element => (element.value == option.title + " " + option.first_name + " " + option.last_name + " " + option.table)
                    && (element.table == option.table))) {
                    options.push({
                        name: option.title + " " + option.first_name + " " + option.last_name,
                        value: option.title + " " + option.first_name + " " + option.last_name + " " + option.table,
                        table: option.table
                    })
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
                        <a href={"find_table?" + "name=" + this.state.info.name + "&table=" + this.state.table}>Find Your Table</a>
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
                        placeholder="Select your host's name"
                        value={this.state.selection}
                        onChange={(value) => this.onChange(value)}
                    />
                </div>
                {this.getButton()}
            </div>
        );
    }
}