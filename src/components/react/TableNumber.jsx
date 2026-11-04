import React from "react";
import { loadAttendees, fullName, withKey } from "../../lib/attendees.js";
import { url } from "../../lib/url.js";
import { EVENT } from "../../lib/event.js";
import { BUTTON_PRIMARY, BUTTON_SECONDARY } from "../../lib/ui.js";


let funName = "laura smith"


export default class TableNumber extends React.Component {

    constructor() {
        super();

        let queryString = window.location.search;
        let urlParams = new URLSearchParams(queryString);

        this.state = {
            name: urlParams.get('name') || "",
            table: urlParams.get('table') || "",
            showAttendeesByTable: false,
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
            <section className="mx-auto max-w-xl px-5 pt-12 text-center sm:pt-16 rise">
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

                <div className="mx-auto mt-6 flex aspect-square w-48 flex-col items-center justify-center rounded-full border-2 border-gold/60 bg-ink-800/80 shadow-glow sm:w-56">
                    <span className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-soft">Table</span>
                    <span className="font-serif text-7xl font-bold leading-none text-gold sm:text-8xl">{this.state.table}</span>
                </div>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                    <a
                        href={withKey(url("table_map/?") + new URLSearchParams({ table: this.state.table }))}
                        className={BUTTON_PRIMARY}
                    >
                        Show me on the map
                    </a>
                    <button
                        type="button"
                        className={BUTTON_SECONDARY}
                        aria-expanded={this.state.showAttendeesByTable}
                        onClick={() => this.setState({ showAttendeesByTable: !this.state.showAttendeesByTable })}
                    >
                        {this.state.showAttendeesByTable ? "Hide tablemates" : "Who's at my table?"}
                    </button>
                </div>

                {this.state.showAttendeesByTable && (
                    <ul className="mx-auto mt-6 max-w-sm space-y-1.5 rounded-3xl border border-white/10 bg-ink-800/70 p-6 font-serif text-xl text-slate-100">
                        {this.state.tablemates.map((attendee, index) => (
                            <li key={index}>{fullName(attendee)}</li>
                        ))}
                    </ul>
                )}
            </section>
        );
    }
}
