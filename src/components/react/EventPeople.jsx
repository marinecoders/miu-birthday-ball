import React, { useEffect, useState } from "react";
import { loadEventPeople } from "../../lib/attendees.js";

// Honored guests and ceremony participants for the Information page.
// They're encrypted (public/event.enc.json) and need the key from the table's
// QR code; without it, this shows a short note instead.
function Card({ label, person }) {
    if (!person) return null;
    return (
        <div className="rounded-3xl border border-white/10 bg-ink-800/70 p-6 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-soft">{label}</p>
            <p className="mt-2 font-serif text-2xl font-semibold text-white text-balance">{person.name}</p>
            {person.details?.length > 0 && (
                <ul className="mt-3 space-y-1 text-sm text-slate-300">
                    {person.details.map(d => <li key={d}>{d}</li>)}
                </ul>
            )}
        </div>
    );
}

export default function EventPeople() {
    const [people, setPeople] = useState(undefined); // undefined = loading, null = locked

    useEffect(() => {
        loadEventPeople().then(setPeople);
    }, []);

    if (people === undefined) {
        return <p className="text-center text-sm text-slate-400">Loading…</p>;
    }
    if (people === null) {
        return (
            <p className="mx-auto max-w-md rounded-2xl border border-white/10 bg-ink-800/60 px-5 py-4 text-center text-sm text-slate-300">
                Scan the QR code on your table to see tonight's honored guests and ceremony participants.
            </p>
        );
    }

    return (
        <div className="space-y-12">
            <section aria-labelledby="honored-title">
                <h2 id="honored-title" className="text-center font-serif text-2xl font-semibold text-white sm:text-3xl">
                    Honored Guests
                </h2>
                <div className="mt-6 grid gap-4">
                    <Card label="Guest of Honor" person={people.guestOfHonor} />
                    <div className="grid gap-4 sm:grid-cols-2">
                        <Card label="Oldest Marine" person={people.oldestMarine} />
                        <Card label="Youngest Marine" person={people.youngestMarine} />
                    </div>
                </div>
                <p className="mx-auto mt-4 max-w-lg text-center text-sm text-slate-400">
                    By tradition, the first piece of cake goes to the Guest of Honor. The next is passed from the
                    oldest Marine present to the youngest, symbolizing experience handed to the next generation.
                </p>
            </section>

            {people.participants?.length > 0 && (
                <section aria-labelledby="participants-title">
                    <h2 id="participants-title" className="text-center font-serif text-2xl font-semibold text-white sm:text-3xl">
                        Ceremony Participants
                    </h2>
                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                        {people.participants.map(group => (
                            <div key={group.group} className="rounded-3xl border border-white/10 bg-ink-800/70 p-6">
                                <h3 className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-soft">{group.group}</h3>
                                <dl className="mt-3 space-y-3">
                                    {group.roles.map(role => (
                                        <div key={role.role}>
                                            <dt className="text-sm text-slate-400">{role.role}</dt>
                                            <dd className="font-serif text-lg text-white" style={{ whiteSpace: "pre-wrap" }}>{role.names.join("\n")}</dd>
                                        </div>
                                    ))}
                                </dl>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
