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
        // TODO READ IN JSON                    
        this.setState({options: [
            {name: 'John Smith', value: 'John Smith', table: 9},
            {name: 'Jane Smith', value: 'Jane Smith', table: 9},
            {name: 'Richard Smitz', value: 'Richard Smitz', table: 12},
            {name: 'Bobby Orr', value: 'Bobby Orr', table: 5},
            {name: 'Ron Burgundy', value: 'Ron Burgundy', table: 2},
            {name: 'Luke Skywalker', value: 'Luke Skywalker', table: 19},
            {name: 'Col. Mustard', value: 'Col. Mustard', table: 11},
            {name: 'Gordie Howe', value: 'Gordie Howe', table: 16},
            {name: 'Pavel Datsyuk', value: 'Pavel Datsyuk', table: 4},
            {name: 'Steve Yzerman', value: 'Steve Yzerman', table: 1},
            {name: 'Nick Lidstrom', value: 'Nick Lidstrom', table: 9},
            {name: 'Terry Sawchuck', value: 'Terry Sawchuck', table: 20},
        ]});
    }
    
    onChange = (selection) => {
        let guest = this.state.options.find(guest => guest.value == selection)
        if (guest !== null) {
            this.setState({selection, table: guest.table});
        }
    }

    getButton = () => {
        if (this.state.selection != "") {
            return (
                <div className="flex justify-center mt-10">
                    <div className="inline-flex items-center justify-center gap-2 px-4 py-3 mb-2 text-xs font-semibold leading-loose text-white transition-all bg-red-800 border border-transparent rounded-md hover:ring-2 focus:outline-none focus:ring-2 ring-offset-white focus:ring-red-500 hover:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800">
                        <a href={"find_table?" + "name=" + this.state.selection + "&table=" + this.state.table}>Find Your Table</a>
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