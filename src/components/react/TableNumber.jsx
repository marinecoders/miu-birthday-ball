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
            table: urlParams.get('table'),
            attendees: [], // You need to pass state from the fetch call to this component
            showAttendees: ""
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
                <div className="mx-auto mt-5 text-center text-lg text-slate-400">
                    <p className="text-slate-300 tracking-wider text-xl">{this.state.name}</p>
                    <p className="italic">
                        Please make your way to
                    </p>
                </div>
                    <div className="text-center">
                        <button className="block text-5xl font-bold mx-auto my-6 text-red-700" onClick={() => this.setState({ showAttendees: this.state.table })}
                        >
                        Table {this.state.table}
                        </button>
                    </div>
                {/* {this.state.showAttendees && (
                    <div className="mx-12 my-10 rounded-3xl text-center font-serif">
                        <h3 className="text-3xl underline decoration-2 underline-offset-8 mb-2 text-slate-400">
                            Table {this.state.table}
                        </h3>
                        <ul className="text-xl text-slate-50 tracking-wide">
                            {this.props.attendees[this.state.table].map((attendee, index) => (
                            <li key={index}>
                                {attendee.title} {attendee.first_name} {attendee.last_name}
                            </li>
                            ))}
                        </ul>
                    </div>
                )} */}
            </div>
        );
    }
}