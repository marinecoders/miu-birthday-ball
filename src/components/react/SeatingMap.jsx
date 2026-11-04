import React, { useEffect, useRef, useState } from "react";
import { Stage, Layer, Circle, Group, Text, Rect, Line, Arrow } from "react-konva";
import HandDrawnCircle from "./HandDrawnCircle.jsx";
import YouAreHere from "./YouAreHere.jsx";
import floorPlan from "../../lib/floor-plan.json";

const MIN_WIDTH = 720;
const MAX_WIDTH = 960;

function getWidth() {
    return Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, window.innerWidth - 24));
}

function MapLabel({ x, y, width, height = 8, text, fontSize = 4, fill = "#64748b", ...props }) {
    return <Text x={x} y={y} width={width} height={height} text={text}
        fontSize={fontSize} fill={fill} fontFamily="Arial, sans-serif"
        align="center" verticalAlign="middle" {...props} />;
}

// A gap in the wall with a pair of open door leaves, in floor-plan units.
function Doors({ x, y, direction = 1 }) {
    return <Group listening={false}>
        <Line points={[x - 9, y, x + 9, y]} stroke="#fafaf9" strokeWidth={3} />
        <Line points={[x - 9, y, x - 9, y + 8 * direction, x, y, x + 9, y + 8 * direction, x + 9, y]}
            stroke="#94a3b8" strokeWidth={0.7} lineJoin="round" />
    </Group>;
}

// The reference plan's tables 8–41 become 1–34. Coordinates are shared with
// the guest-list tools; sourceTable records the number in the reference image.
export default function SeatingMap({ table }) {
    const [width, setWidth] = useState(getWidth);
    const [wider, setWider] = useState(false);
    const scroller = useRef(null);
    const selectedNumber = String(table ?? new URLSearchParams(window.location.search).get("table") ?? "");
    const mine = floorPlan.tables.find(t => String(t.number) === selectedNumber);
    const scale = width / floorPlan.width;

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
        <div ref={scroller}
            className="overflow-x-auto overscroll-x-contain rounded-2xl border border-white/10 shadow-2xl shadow-black/40"
            style={{ maxWidth: width + 2, margin: "0 auto" }}
            role="img" aria-label={`Ballroom floor plan, tables 1–34 in four rows. ${mine
                ? `Table ${mine.number} is circled in red in seating row ${mine.row}, counting from the podium.`
                : "The podium is at the top and the main entrance is at the bottom."}`}>
            <Stage width={width} height={floorPlan.height * scale}
                style={{ pointerEvents: "none", backgroundColor: "#fafaf9", width }}>
                <Layer scaleX={scale} scaleY={scale} listening={false}>
                    {/* Ballroom and the foyer/bar area, oriented as in the reference. */}
                    <Line points={[12, 220, 12, 292, 244, 292, 244, 248, 280, 248, 324, 284, 350, 262, 343, 220]}
                        fill="#f1f5f9" stroke="#475569" strokeWidth={1.2} closed />
                    <Rect x={12} y={18} width={336} height={202}
                        fill="#fafaf9" stroke="#334155" strokeWidth={1.5} />
                    {[78, 148, 224, 302].map(x => <Doors key={`back-${x}`} x={x} y={220} />)}

                    {/* The removed front row stays open; the ceremony area remains. */}
                    {[47, 220].map(x => <Group key={x}>
                        <Rect x={x} y={22} width={50} height={13} fill="#e2e8d3" cornerRadius={1.5} />
                        <MapLabel x={x} y={24} width={50} text="PROJECTOR" fontSize={3.5} fill="#526442" />
                    </Group>)}
                    <Rect x={136} y={42} width={60} height={57} fill="#e7e5e4"
                        stroke="#cbd5e1" strokeWidth={0.7} cornerRadius={2} />
                    <MapLabel x={139} y={60} width={54} height={20} text={"CEREMONY\nAREA"}
                        fontSize={4.5} fill="#64748b" lineHeight={1.4} />
                    <Rect x={151} y={26} width={30} height={12} fill="#334155" cornerRadius={1} />
                    <MapLabel x={151} y={28} width={30} text="PODIUM" fontSize={4} fill="#ffffff" fontStyle="bold" />
                    <Group id="narrator-podium">
                        <MapLabel x={186} y={25} width={36} text="NARRATOR" fontSize={3.2} />
                        <Rect x={198} y={32} width={12} height={9} fill="#334155" cornerRadius={1} />
                        <Line points={[200, 34, 208, 34]} stroke="#cbd5e1" strokeWidth={0.6} />
                    </Group>
                    <Arrow points={[148, 237, 148, 226, 163, 226, 163, 105]}
                        stroke="#94a3b8" fill="#94a3b8" strokeWidth={1} dash={[3, 3]}
                        pointerLength={4} pointerWidth={3} lineJoin="round" />

                    {/* VIP positions follow the highlighted tables in the reference. */}
                    <Circle x={43} y={53} radius={3} fill="#fff0bf" stroke="#b8954a" strokeWidth={0.6} />
                    <MapLabel x={49} y={49} width={48} text="VIP TABLES" fontSize={3.5} align="left" />

                    <Rect x={13} y={250} width={39} height={41} fill="#e2e8f0"
                        stroke="#94a3b8" strokeWidth={0.7} />
                    <MapLabel x={74} y={251} width={140} text="FOYER" fontSize={5} fill="#64748b" letterSpacing={1.2} />
                    {[77, 139, 201].map(x => <Group key={`bar-${x}`}>
                        <Rect x={x} y={276} width={34} height={9} fill="#cbd5e1" cornerRadius={1} />
                        <MapLabel x={x} y={277} width={34} height={7} text="BAR" fontSize={3.8} fill="#334155" />
                    </Group>)}

                    {floorPlan.tables.map(t => {
                        const isMine = t === mine;
                        const radius = floorPlan.tableRadius;
                        return <Group key={t.number} id={`table-${t.number}`}>
                            <Circle x={t.x} y={t.y} radius={radius}
                                fill={isMine ? "#FFC72C" : t.vip ? "#fff0bf" : "#e5e7eb"}
                                stroke={t.vip ? "#b8954a" : "#334155"} strokeWidth={isMine ? 1.1 : 0.7} />
                            <MapLabel x={t.x - radius} y={t.y - radius}
                                width={radius * 2} height={radius * 2}
                                text={String(t.number)} fontSize={6.2} fontStyle="bold" fill="#0B0F17" />
                        </Group>;
                    })}
                    {mine && <HandDrawnCircle x={mine.x} y={mine.y} radius={11}
                        seed={mine.number} strokeWidth={1.2} />}
                </Layer>
                <Layer listening={false}>
                    <YouAreHere x={floorPlan.entrance.x * scale} y={floorPlan.entrance.y * scale} unit={scale} />
                </Layer>
            </Stage>
        </div>
        {wider && <p className="mt-2 text-center text-xs text-slate-400">Swipe sideways to see the whole room</p>}
        {selectedNumber && !mine && <p className="mt-2 text-center text-sm text-gold" role="status">
            Table {selectedNumber} is not on this floor plan. Please check with the entrance staff.
        </p>}
    </>;
}
