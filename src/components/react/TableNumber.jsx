import React from "react";
import 'react-select-search/style.css'


let funName = "pierce-wrobel"
let attendeesList = JSON.parse(localStorage.getItem('attendees'))


export default class DropDown extends React.Component {

    constructor() {
        super();
        
        let queryString = window.location.search;
        let urlParams = new URLSearchParams(queryString);

        this.state = {
            name: urlParams.get('name'),
            table: urlParams.get('table'),
            showAttendeesByTable: false
        }
    }

    render() {
        return(
            <div>
            <div className="max-w-[85rem] mx-auto px-4 pt-inherit pt-12">
                <div className="max-w-6xl mx-auto text-center">
                {this.state.name.toLowerCase().includes(funName.toLowerCase()) && <div>
                    <img src={"../../../funFlag.svg"} alt="Fun Flag" className="mx-auto my-4 h-40 drop-shadow-xl" />
                    <p class="text-2xl my-2 text-red-700">Welcome to this side of the Pond!</p>
                </div>}
                {!this.state.name.toLowerCase().includes(funName.toLowerCase()) &&
                <h1 className="block text-4xl font-bold">
                    {"Welcome to the 249th Marine Corps Birthday Ball"}
                </h1>}
                </div>
            </div>
            <div className="mx-auto mt-5 text-center text-lg text-slate-400">
                <p className="text-slate-300 tracking-wider text-xl">{this.state.name}</p>
               
                <p className="italic">
                Please make your way to
                </p>
            </div>
                <div className="text-center">
                <button className="block text-5xl font-bold mx-auto my-6 text-red-700" onClick={() => this.setState({           showAttendeesByTable: !this.state.showAttendeesByTable })}
                >
                Table {this.state.table}
                </button>
                </div>
            {this.state.showAttendeesByTable && (
                <div className="mx-12 my-10 rounded-3xl text-center font-serif">
                    <ul className="text-xl text-slate-50 tracking-wide">
                        {console.log(attendeesList)}
                        {attendeesList.byTable[this.state.table].map((attendee, index) => (
                            <li key={index}>
                            {attendee.title} {attendee.first_name} {attendee.last_name}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            </div>
        );
    }
}