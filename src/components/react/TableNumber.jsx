import React from "react";
import SelectSearch from "react-select-search";
import 'react-select-search/style.css'

export default class DropDown extends React.Component {

    constructor() {
        super();
        
        let queryString = window.location.search;
        let urlParams = new URLSearchParams(queryString);
        this.state = {
            name: urlParams.get('name'),
            table: urlParams.get('table')
        }
    }

    render() {
        return(
            <div>
                <div className={["max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 pt-inherit pt-12"]}>
                    <div className="max-w-6xl mx-auto text-center">
                        <h1 className="block text-4xl font-bold md:text-5xl lg:text-6xl">
                            {"Welcome to the 249th Marine Corps Birthday Ball"}
                        </h1>
                    </div>
                </div>
                <div class="mx-auto mt-5 text-center text-lg text-slate-400">
                    <p class="text-slate-300 tracking-wider text-xl">{this.state.name}</p>
                    <p class="italic">
                        Please make your way to
                    </p>
                </div>
                    <div className="max-w-6xl mx-auto mt-6 mb-10 text-center">
                        <h1 className="block text-5xl font-bold md:text-5xl lg:text-6xl text-red-700">
                            Table {this.state.table}
                        </h1>
                    </div>
            </div>
        );
    }
}