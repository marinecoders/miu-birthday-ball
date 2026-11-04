import React from "react";
import { loadAttendees, fullName } from "../../lib/attendees.js";
import { EVENT } from "../../lib/event.js";
import SeatingMap from "./SeatingMap.jsx";


let funName = "laura smith"


export default class TableNumber extends React.Component {

    constructor() {
        super();

        let queryString = window.location.search;
        let urlParams = new URLSearchParams(queryString);

        this.state = {
            name: urlParams.get('name') || "",
            table: urlParams.get('table') || "",
            tablemates: []
        }
    }

    componentDidMount() {
        loadAttendees().then(({ byTable }) => {
            this.setState({ tablemates: byTable[this.state.table] || [] })
        }).catch(() => {});
    }

    render() {
        const isFunName = this.state.name.toLowerCase().includes(funName)
        return(
            <section className="pt-12 sm:pt-16 rise">
              <div className="mx-auto max-w-xl px-5 text-center">
                {isFunName ? (
                    <div>
                        <p className="text-7xl sm:text-8xl" aria-hidden="true">🇬🇧</p>
                        <p className="mt-3 font-serif text-2xl text-scarlet-light">Welcome to this side of the Pond!</p>
                    </div>
                ) : (
                    <p className="text-xs font-semibold uppercase tracking-[0.35em] text-gold-soft">
                        {EVENT.title}
                    </p>
                )}

                <h1 className="mt-6 font-serif text-3xl font-semibold text-white text-balance sm:text-4xl">
                    {this.state.name}
                </h1>
                <p className="mt-2 text-slate-400">Please make your way to</p>

                <div className="mx-auto mt-6 flex aspect-square w-40 flex-col items-center justify-center rounded-full border-2 border-gold/60 bg-ink-800/80 shadow-glow sm:w-48">
                    <span className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-soft">Table</span>
                    <span className="font-serif text-7xl font-bold leading-none text-gold">{this.state.table}</span>
                </div>
              </div>

              <div className="mx-auto mt-10 max-w-5xl px-3 sm:px-5">
                <h2 className="mb-3 text-center text-xs font-semibold uppercase tracking-[0.3em] text-gold-soft">
                    Where to find it
                </h2>
                <SeatingMap table={this.state.table} />
              </div>

              <div className="mx-auto mt-10 max-w-xl px-5 text-center">
                <h2 className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-soft">
                    Seated with you
                </h2>
                <ul className="mx-auto mt-4 max-w-sm space-y-1.5 rounded-3xl border border-white/10 bg-ink-800/70 p-6 font-serif text-xl text-slate-100">
                    {this.state.tablemates.length === 0 && (
                        <li className="font-rubik text-base text-slate-400">Loading…</li>
                    )}
                    {this.state.tablemates.map((attendee, index) => {
                        const isMe = fullName(attendee) === this.state.name
                        return (
                            <li key={index} className={isMe ? "font-semibold text-gold" : ""}>
                                {fullName(attendee)}{isMe && <span className="sr-only"> (you)</span>}
                            </li>
                        )
                    })}
                </ul>
              </div>
            </section>
        );
    }
}
