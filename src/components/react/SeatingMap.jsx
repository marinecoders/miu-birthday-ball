import React, { useEffect, useMemo, useRef, useState } from "react";
import { Stage, Layer, Circle, Group, Text, Rect, Line, Path } from "react-konva";
import HandDrawnCircle from "./HandDrawnCircle.jsx";
import YouAreHere from "./YouAreHere.jsx";
import RouteArrow from "./RouteArrow.jsx";
import floorPlan from "../../lib/floor-plan.json";
import doorSettings from "../../lib/doors.json";
import { getDoor } from "../../lib/entry.js";
import { findTableRoute } from "../../lib/table-route.js";

const MIN_WIDTH = 720;
const MAX_WIDTH = 960;
const { ceremony, podium, narrator, pow } = Object.fromEntries(floorPlan.obstacles.map(o => [o.id, o]));
const projectors = floorPlan.obstacles.filter(o => o.id.startsWith("projector-"));
const aisle = floorPlan.ceremonyAisle;
const tableRange = `${floorPlan.tables[0].number}–${floorPlan.tables.at(-1).number}`;
const rowCount = new Set(floorPlan.tables.map(table => table.row)).size;

function getWidth() {
    return Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, window.innerWidth - 24));
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

// Three rows flank the clear ceremony aisle, numbered left to right from the podium.
// Coordinates are shared with routing and the guest-list tools.
export default function SeatingMap({ table, door }) {
    const [width, setWidth] = useState(getWidth);
    const [wider, setWider] = useState(false);
    const scroller = useRef(null);
    const selectedNumber = String(table ?? new URLSearchParams(window.location.search).get("table") ?? "");
    const mine = floorPlan.tables.find(t => String(t.number) === selectedNumber);
    const scale = width / floorPlan.width;
    // "You are here": the door on the guest's QR code (src/lib/doors.json),
    // or the main entrance when the link has no door.
    const [scannedDoor, setScannedDoor] = useState(() => getDoor());
    const doorNumber = String(door ?? scannedDoor ?? "");
    const here = doorSettings.doors[doorNumber] ?? { ...floorPlan.entrance, label: "above" };
    const route = useMemo(() => findTableRoute(floorPlan, doorSettings.doors[doorNumber], selectedNumber),
        [doorNumber, selectedNumber]);
    const routeDescription = mine ? route
        ? `Follow the blue path from Entry ${doorNumber} to Table ${mine.number}.`
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
        const resize = () => setWidth(getWidth());
        window.addEventListener("resize", resize);
        return () => window.removeEventListener("resize", resize);
    }, []);

    useEffect(() => {
        const box = scroller.current;
        const center = () => {
            const needsScroll = box.scrollWidth > box.clientWidth + 1;
            setWider(needsScroll);
            if (needsScroll && mine) box.scrollLeft = mine.x * scale - box.clientWidth / 2;
        };
        center();
        const observer = new ResizeObserver(center);
        observer.observe(box);
        return () => observer.disconnect();
    }, [width, selectedNumber]);

    return <>
        {routeDescription && <p className="mb-3 text-center text-sm text-slate-300" role="status">
            {routeDescription}
        </p>}
        <div ref={scroller}
            className="overflow-x-auto overscroll-x-contain rounded-2xl border border-white/10 shadow-2xl shadow-black/40"
            style={{ maxWidth: width + 2, margin: "0 auto" }}
            role="img" aria-label={`Ballroom floor plan, tables ${tableRange} in ${rowCount} rows on either side of a clear ceremony aisle. The unnumbered POW/MIA table is to the right of Entry 2. Entries 1–4 run right to left along the bottom wall. ${mine
                ? `Table ${mine.number} is circled in red in seating row ${mine.row}, counting from the podium.`
                : "The podium is at the top and the main entrance is at the bottom."} ${routeDescription}`}>
            <Stage width={width} height={floorPlan.height * scale}
                style={{ pointerEvents: "none", backgroundColor: "#fafaf9", width }}>
                <Layer scaleX={scale} scaleY={scale} listening={false}>
                    {/* Ballroom and the foyer/bar area, oriented as in the reference. */}
                    <Group id="foyer">
                        <Line points={[54, 220, 54, 254, 46.5, 254, 46.5, 292, 244, 292, 244, 248, 280, 248, 324, 284, 350, 262, 343, 220]}
                            fill="#f1f5f9" stroke="#475569" strokeWidth={1.2} closed />
                        {/* The west wall steps out below the side double doors. */}
                        <Line points={[54, 232, 54, 250]} stroke="#fafaf9" strokeWidth={3} />
                        <Path data="M54 232 H45 A9 9 0 0 0 54 241 M54 250 H45 A9 9 0 0 1 54 241"
                            stroke="#94a3b8" strokeWidth={0.7} />
                    </Group>
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

                    <MapLabel x={74} y={251} width={140} text="FOYER" fontSize={5} fill="#64748b" letterSpacing={1.2} />
                    {[77, 139, 201].map(x => <Group key={`bar-${x}`}>
                        <Rect x={x} y={276} width={34} height={9} fill="#cbd5e1" cornerRadius={1} />
                        <MapLabel x={x} y={277} width={34} height={7} text="BAR" fontSize={3.8} fill="#334155" />
                    </Group>)}

                    {route && <RouteArrow route={route} />}

                    {floorPlan.tables.map(t => {
                        const isMine = t === mine;
                        const radius = floorPlan.tableRadius;
                        return <Group key={t.number} id={`table-${t.number}`}>
                            <Circle x={t.x} y={t.y} radius={radius}
                                fill={isMine ? "#FFC72C" : "#e5e7eb"}
                                stroke="#334155" strokeWidth={isMine ? 1.1 : 0.7} />
                            <MapLabel x={t.x - radius} y={t.y - radius}
                                width={radius * 2} height={radius * 2}
                                text={String(t.number)} fontSize={6.2} fontStyle="bold" fill="#0B0F17" />
                        </Group>;
                    })}
                    {mine && <HandDrawnCircle x={mine.x} y={mine.y} radius={11}
                        strokeWidth={1.8} />}
                </Layer>
                <Layer listening={false}>
                    <YouAreHere x={here.x * scale} y={here.y * scale} unit={scale}
                        label={route ? "below" : here.label} />
                </Layer>
            </Stage>
        </div>
        {wider && <p className="mt-2 text-center text-xs text-slate-400">Swipe sideways to see the whole room</p>}
        {selectedNumber && !mine && <p className="mt-2 text-center text-sm text-gold" role="status">
            Table {selectedNumber} is not on this floor plan. Please check with the entrance staff.
        </p>}
    </>;
}
