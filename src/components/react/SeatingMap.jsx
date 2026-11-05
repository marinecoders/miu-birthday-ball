import React, { useEffect, useMemo, useRef, useState } from "react";
import { Stage, Layer, Circle, Group, Text, Rect, Line, Path } from "react-konva";
import HandDrawnCircle from "./HandDrawnCircle.jsx";
import YouAreHere from "./YouAreHere.jsx";
import RouteArrow from "./RouteArrow.jsx";
import RestroomMarker from "./RestroomMarker.jsx";
import floorPlan from "../../lib/floor-plan.json";
import doorSettings from "../../lib/doors.json";
import { getDoor } from "../../lib/entry.js";
import { findTableRoute } from "../../lib/table-route.js";
import { getMapView } from "../../lib/map-view.js";

const MAX_WIDTH = 960;
const { ceremony, podium, narrator, pow } = Object.fromEntries(floorPlan.obstacles.map(o => [o.id, o]));
const projectors = floorPlan.obstacles.filter(o => o.id.startsWith("projector-"));
const aisle = floorPlan.ceremonyAisle;
const tableRange = `${floorPlan.tables[0].number}–${floorPlan.tables.at(-1).number}`;
const rowCount = new Set(floorPlan.tables.map(table => table.row)).size;

function getViewport(width = window.innerWidth - 24) {
    return {
        width: Math.min(MAX_WIDTH, Math.max(1, width)),
        compact: window.innerWidth < 768 || window.innerHeight < 500,
        maxHeight: Math.max(240, Math.min(560, window.innerHeight * 0.65)),
    };
}

function MapLabel({ x, y, width, height = 8, text, fontSize = 4, fill = "#64748b", ...props }) {
    return <Text x={x} y={y} width={width} height={height} text={text}
        fontSize={fontSize} fill={fill} fontFamily="Arial, sans-serif"
        align="center" verticalAlign="middle" {...props} />;
}

// A gap in the wall with a pair of open door leaves, in floor-plan units.
function Doors({ x, y, direction = 1, label }) {
    return <Group listening={false}>
        <Line points={[x - 9, y, x + 9, y]} stroke="#fafaf9" strokeWidth={3} />
        <Line points={[x - 9, y, x - 9, y + 8 * direction, x, y, x + 9, y + 8 * direction, x + 9, y]}
            stroke="#94a3b8" strokeWidth={0.7} lineJoin="round" />
        <MapLabel x={x - 26} y={y - 12} width={24} height={8}
            text={label} fontSize={3.8} fontStyle="bold" fill="#334155" />
    </Group>;
}

// Staggered rows flank the ceremony aisle; table 22 sits behind the left block.
// Coordinates are shared with routing and the guest-list tools.
// venue: the Information-page map. No guest table, route, entry pin, or view
// buttons (the restrooms come from floor-plan.json, as on every map).
export default function SeatingMap({ table, door, venue = false }) {
    const [viewport, setViewport] = useState(getViewport);
    const [viewChoice, setViewChoice] = useState(null);
    const container = useRef(null);
    const selectedNumber = venue ? "" : String(table ?? new URLSearchParams(window.location.search).get("table") ?? "");
    const mine = floorPlan.tables.find(t => String(t.number) === selectedNumber);
    // "You are here": the door on the guest's QR code (src/lib/doors.json),
    // or the main entrance when the link has no door.
    const [scannedDoor, setScannedDoor] = useState(() => getDoor());
    const doorNumber = String(door ?? scannedDoor ?? "");
    const here = doorSettings.doors[doorNumber] ?? { ...floorPlan.entrance, label: "above" };
    const route = useMemo(() => venue ? null : findTableRoute(floorPlan, doorSettings.doors[doorNumber], selectedNumber),
        [doorNumber, selectedNumber, venue]);
    const plan = floorPlan;
    const viewContext = `${selectedNumber}:${doorNumber}`;
    const mode = viewChoice?.context === viewContext ? viewChoice.mode
        : viewport.compact && route ? "route" : "room";
    const { width } = viewport;
    const height = Math.round(viewport.compact
        ? mode === "room" ? width * plan.height / plan.width
            : Math.min(viewport.maxHeight, mode === "table" ? width : Math.max(280, width * 1.1))
        : width * plan.height / plan.width);
    const view = getMapView(plan, { width, height, mode, route, table: mine, origin: here });
    const { scale } = view;
    const chooseView = mode => setViewChoice({ context: viewContext, mode });
    const firstIndoorPoint = route?.find(point => point.y < floorPlan.ballroom.y + floorPlan.ballroom.height);
    const routedEntry = Object.entries(doorSettings.doors)
        .find(([, entry]) => !entry.via && entry.x === firstIndoorPoint?.x)?.[0];
    const originName = here.via ? here.name : `Entry ${doorNumber}`;
    const routeDescription = mine ? route
        ? `Follow the blue path from ${originName}${here.via ? ` through Entry ${routedEntry}` : ""} to Table ${mine.number}.`
        : doorSettings.doors[doorNumber]
            ? "A clear route could not be found. Please ask the entrance staff for directions."
            : "Scan the QR code at your entry to see a path to your table."
        : "";

    useEffect(() => {
        const updateDoor = () => setScannedDoor(getDoor());
        window.addEventListener("hashchange", updateDoor);
        window.addEventListener("popstate", updateDoor);
        return () => {
            window.removeEventListener("hashchange", updateDoor);
            window.removeEventListener("popstate", updateDoor);
        };
    }, []);

    useEffect(() => {
        const box = container.current;
        const resize = () => {
            const next = getViewport(box.clientWidth);
            setViewport(previous => previous.width === next.width && previous.compact === next.compact
                && previous.maxHeight === next.maxHeight ? previous : next);
        };
        resize();
        const observer = new ResizeObserver(resize);
        observer.observe(box);
        window.addEventListener("resize", resize);
        return () => {
            observer.disconnect();
            window.removeEventListener("resize", resize);
        };
    }, []);

    return <>
        {routeDescription && <p className="mb-3 text-center text-sm text-slate-300" role="status">
            {routeDescription}
        </p>}
        {mine && <div className="mb-3 flex flex-wrap justify-center gap-2" role="group" aria-label="Map view">
            {[...(route ? [["route", "Fit route"]] : []), ["room", "Whole room"], ["table", "My table"]].map(([value, label]) =>
                <button key={value} type="button" aria-pressed={mode === value} onClick={() => chooseView(value)}
                    className={`min-h-11 rounded-full border px-3 py-2 text-sm font-medium transition focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-gold ${mode === value
                        ? "border-gold/70 bg-gold/15 text-gold" : "border-white/20 bg-ink-800 text-slate-300 hover:border-white/40"}`}>
                    {label}
                </button>)}
        </div>}
        <div ref={container}
            className="overflow-hidden rounded-2xl border border-white/10 shadow-2xl shadow-black/40"
            style={{ width: "100%", maxWidth: MAX_WIDTH + 2, margin: "0 auto" }}
            role="img" aria-label={venue
                ? `Ballroom floor plan with tables ${tableRange} in ${rowCount} seating rows on either side of the ceremony aisle, the podium at the top, and entries 1–4 along the bottom wall opening into the foyer and bars. Restrooms are outside the right wall; a dashed guide leads from the lower-right foyer to the restroom icon near the top-right corner.`
                : `Ballroom floor plan, tables ${tableRange} in ${rowCount} seating rows, with staggered tables on either side of a clear ceremony aisle. The unnumbered POW/MIA table is to the right of Entry 2. Restrooms are outside the right wall; a dashed guide leads from the lower-right foyer to the restroom icon near the top-right corner. Entries 1–4 run right to left along the bottom wall. ${mine
                ? `Table ${mine.number} is circled in red in seating row ${mine.row}, counting from the podium.`
                : "The podium is at the top and the main entrance is at the bottom."} ${routeDescription}`}>
            <Stage width={width} height={height}
                style={{ pointerEvents: "none", backgroundColor: "#fafaf9", width }}>
                <Layer x={view.x} y={view.y} scaleX={scale} scaleY={scale} listening={false}>
                    {/* Ballroom and the foyer/bar area, oriented as in the reference. */}
                    <Group id="foyer">
                        {/* The foyer opens into the restroom passage on the right. */}
                        <Line points={[54, 220, 54, 254, 46.5, 254, 46.5, 292, 256, 292,
                            256, 276, 228, 248, 292, 248, 303, 259, 315, 248, 343, 276,
                            371, 248, floorPlan.width, 248, floorPlan.width, 220]}
                            fill="#f1f5f9" closed />
                        <Line points={[54, 220, 54, 254, 46.5, 254, 46.5, 292, 256, 292, 256, 276]}
                            stroke="#475569" strokeWidth={1.2} />
                        <Line points={[244, 248, 292, 248, 303, 259, 315, 248, 343, 276,
                            371, 248, floorPlan.width, 248]}
                            stroke="#475569" strokeWidth={1.2} />
                        <Group id="foyer-stairs">
                            <Line points={[228, 248, 244, 248, 265, 269, 256, 276]}
                                fill="#fafaf9" closed />
                            {Array.from({ length: 8 }, (_, index) => 8 + index * 20 / 7).map(step =>
                                <Line key={step} points={[228 + step, 248 + step, 236 + step, 240 + step]}
                                    stroke="#475569" strokeWidth={0.4} />)}
                            <Line points={[228, 248, 256, 276]} stroke="#475569" strokeWidth={1.2} />
                            <Line points={[244, 248, 265, 269]} stroke="#475569" strokeWidth={1.2} />
                        </Group>
                        {/* The west wall steps out below the side double doors. */}
                        <Line points={[54, 232, 54, 250]} stroke="#fafaf9" strokeWidth={3} />
                        <Path data="M54 232 H45 A9 9 0 0 0 54 241 M54 250 H45 A9 9 0 0 1 54 241"
                            stroke="#94a3b8" strokeWidth={0.7} />
                    </Group>
                    <RestroomMarker landmark={floorPlan.restrooms} scale={scale} />
                    <Rect {...floorPlan.ballroom}
                        fill="#fafaf9" stroke="#334155" strokeWidth={1.5} />
                    <Group id="ceremony-aisle">
                        <Rect {...aisle} height={aisle.height - 1} fill="#f1f5f9" />
                        {[aisle.x, aisle.x + aisle.width].map(x =>
                            <Line key={x} points={[x, aisle.y, x, aisle.y + aisle.height - 1]}
                                stroke="#cbd5e1" strokeWidth={0.6} dash={[2, 2]} />)}
                        <MapLabel x={aisle.x + 8} y={140} width={aisle.width - 16} height={20}
                            text={"CEREMONY\nAISLE"} fontSize={3.5} fill="#64748b" lineHeight={1.4} />
                    </Group>
                    {[302, 224, 148, 78].map((x, index) =>
                        <Doors key={`back-${x}`} x={x} y={220} label={`Entry ${index + 1}`} />)}

                    {/* The space ahead of the first seating row stays open. */}
                    {projectors.map(projector => <Group key={projector.id}>
                        <Rect {...projector} fill="#e2e8d3" cornerRadius={1.5} />
                        <MapLabel x={projector.x} y={24} width={50} text="PROJECTOR" fontSize={3.5} fill="#526442" />
                    </Group>)}
                    <Rect {...ceremony} fill="#e7e5e4"
                        stroke="#cbd5e1" strokeWidth={0.7} cornerRadius={2} />
                    <MapLabel x={139} y={60} width={54} height={20} text={"CEREMONY\nAREA"}
                        fontSize={4.5} fill="#64748b" lineHeight={1.4} />
                    <Rect {...podium} fill="#334155" cornerRadius={1} />
                    <MapLabel x={151} y={28} width={30} text="PODIUM" fontSize={4} fill="#ffffff" fontStyle="bold" />
                    <Group id="narrator-podium">
                        <MapLabel x={186} y={25} width={36} text="NARRATOR" fontSize={3.2} />
                        <Rect {...narrator} fill="#334155" cornerRadius={1} />
                        <Line points={[200, 34, 208, 34]} stroke="#cbd5e1" strokeWidth={0.6} />
                    </Group>

                    <Group id="pow-table">
                        <Circle x={pow.x + pow.width / 2} y={pow.y + pow.height / 2}
                            radius={pow.width / 2} id="pow-table-top" fill="#ffffff"
                            stroke="#475569" strokeWidth={0.8} />
                        <MapLabel x={pow.x} y={pow.y} width={pow.width} height={pow.height}
                            text={"POW\nMIA"} fontSize={3.4} fill="#334155" fontStyle="bold" lineHeight={1.2} />
                    </Group>

                    <MapLabel x={78} y={251} width={70} text="FOYER" fontSize={5} fill="#64748b" letterSpacing={1.2} />
                    {[77, 139, 201].map(x => <Group key={`bar-${x}`}>
                        <Rect x={x} y={276} width={34} height={9} fill="#cbd5e1" cornerRadius={1} />
                        <MapLabel x={x} y={277} width={34} height={7} text="BAR" fontSize={3.8} fill="#334155" />
                    </Group>)}

                    {route && <RouteArrow route={route} />}

                    {floorPlan.tables.map(t => {
                        const isMine = t === mine;
                        const radius = floorPlan.tableRadius;
                        const labelWidth = Math.max(radius * 2, 14 / scale);
                        const labelHeight = Math.max(radius * 2, 12 / scale);
                        return <Group key={t.number} id={`table-${t.number}`}>
                            <Circle x={t.x} y={t.y} radius={radius}
                                fill={isMine ? "#FFC72C" : "#e5e7eb"}
                                stroke="#334155" strokeWidth={isMine ? 1.1 : 0.7} />
                            <MapLabel x={t.x - labelWidth / 2} y={t.y - labelHeight / 2}
                                width={labelWidth} height={labelHeight} wrap="none"
                                text={String(t.number)} fontSize={Math.max(6.2, 10 / scale)} fontStyle="bold" fill="#0B0F17" />
                        </Group>;
                    })}
                    {mine && <HandDrawnCircle x={mine.x} y={mine.y} radius={11}
                        strokeWidth={1.8} />}
                </Layer>
                {!venue && <Layer x={view.x} y={view.y} listening={false}>
                    <YouAreHere x={here.x * scale} y={here.y * scale} unit={scale}
                        label={route ? "below" : here.label} />
                </Layer>}
            </Stage>
        </div>
        {selectedNumber && !mine && <p className="mt-2 text-center text-sm text-gold" role="status">
            Table {selectedNumber} is not on this floor plan. Please check with the entrance staff.
        </p>}
    </>;
}
