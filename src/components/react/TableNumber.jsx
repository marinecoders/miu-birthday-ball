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
                            {"Welcome to the Marine Corps Ball"}
                        </h1>
                    </div>
                </div>
                <div className="max-w-3xl mx-auto mt-5 text-center">
                    <p className="text-lg text-slate-600 dark:text-slate-400">
                        Please make your way to table number
                    </p>
                </div>
                <div className:list={["max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 pt-inherit"]}>
                    <div className="max-w-6xl mx-auto mt-10 text-center">
                        <h1 className="block text-9xl font-bold md:text-5xl lg:text-6xl text-red-800">
                            {this.state.table}
                        </h1>
                    </div>
                </div>
                <div className="flex justify-center mt-20">
                    <div className="inline-flex items-center justify-center gap-2 px-4 py-3 mb-2 text-xs font-semibold leading-loose text-white transition-all bg-red-800 border border-transparent rounded-md hover:ring-2 focus:outline-none focus:ring-2 ring-offset-white focus:ring-red-500 hover:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800">
                        <a href={"table_map?table=" + this.state.table}>View Venue Map</a>
                    </div>
                </div>
            </div>
        );
    }
}