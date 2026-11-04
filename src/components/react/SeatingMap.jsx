import React from "react";
import { Stage, Layer, Circle, Group, Text, Rect, Line } from 'react-konva';
import HandDrawnCircle from "./HandDrawnCircle.jsx";
import YouAreHere from "./YouAreHere.jsx";
import { getDoor } from "../../lib/attendees.js";
import DOOR_SETTINGS from "../../lib/doors.json";

const DOORS = DOOR_SETTINGS.doors;

// The map is drawn on a 360-unit-wide grid scaled to BASE_SIZE pixels
// (height is 55% of width). Keep it at least MIN_WIDTH so table numbers stay
// readable on phones (guests swipe sideways), and at most MAX_WIDTH on desktop.
const MIN_WIDTH = 720;
const MAX_WIDTH = 960;

function getWidth() {
    let width = window.innerWidth;
    if (window.innerHeight < width * .55 - 68) {
        width = window.innerHeight / .55;
    }
    return Math.round(Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, width)));
}

var BASE_SIZE = getWidth()

function generateShapes() {
    return [
        {
            id: "33",
            x: (70/360) * BASE_SIZE,
            y: (24/360) * BASE_SIZE,
            number: 33,
            rotation: 0
        },
        {
            id: "31",
            x: (82/360) * BASE_SIZE,
            y: (24/360) * BASE_SIZE,
            number: 31,
            rotation: 0
        },
        {
            id: "19",
            x: (94/360) * BASE_SIZE,
            y: (24/360) * BASE_SIZE,
            number: 19,
            rotation: 0
        },
        {
            id: "17",
            x: (106/360) * BASE_SIZE,
            y: (24/360) * BASE_SIZE,
            number: 17,
            rotation: 0
        },
        {
            id: "15",
            x: (118/360) * BASE_SIZE,
            y: (24/360) * BASE_SIZE,
            number: 15,
            rotation: 0
        },
        {
            id: "13",
            x: (129/360) * BASE_SIZE,
            y: (24/360) * BASE_SIZE,
            number: 13,
            rotation: 0
        },
        {
            id: "36",
            x: BASE_SIZE - (70/360) * BASE_SIZE,
            y: (24/360) * BASE_SIZE,
            number: 36,
            rotation: 0
        },
        {
            id: "34",
            x: BASE_SIZE - (82/360) * BASE_SIZE,
            y: (24/360) * BASE_SIZE,
            number: 34,
            rotation: 0
        },
        {
            id: "28",
            x:  BASE_SIZE - (94/360) * BASE_SIZE,
            y: (24/360) * BASE_SIZE,
            number: 28,
            rotation: 0
        },
        {
            id: "26",
            x:  BASE_SIZE - (106/360) * BASE_SIZE,
            y: (24/360) * BASE_SIZE,
            number: 26,
            rotation: 0
        },
        {
            id: "22",
            x:  BASE_SIZE - (118/360) * BASE_SIZE,
            y: (24/360) * BASE_SIZE,
            number: 22,
            rotation: 0
        },
        {
            id: "20",
            x:  BASE_SIZE - (129/360) * BASE_SIZE,
            y: (24/360) * BASE_SIZE,
            number: 20,
            rotation: 0
        },
        {
            id: "41",
            x:  (38/360) * BASE_SIZE,
            y: (48/360) * BASE_SIZE,
            number: 41,
            rotation: 0
        },
        {
            id: "37",
            x:  (46/360) * BASE_SIZE,
            y: (42/360) * BASE_SIZE,
            number: 37,
            rotation: 0
        },
        {
            id: "43",
            x:  (49/360) * BASE_SIZE,
            y: (63/360) * BASE_SIZE,
            number: 43,
            rotation: 0
        },
        {
            id: "45",
            x:  (58/360) * BASE_SIZE,
            y: (55/360) * BASE_SIZE,
            number: 45,
            rotation: 0
        },
        {
            id: "39",
            x:  (66/360) * BASE_SIZE,
            y: (48/360) * BASE_SIZE,
            number: 39,
            rotation: 0
        },
        {
            id: "47",
            x:  (74/360) * BASE_SIZE,
            y: (65/360) * BASE_SIZE,
            number: 47,
            rotation: 0
        },
        {
            id: "49",
            x:  (66/360) * BASE_SIZE,
            y: (74/360) * BASE_SIZE,
            number: 49,
            rotation: 0
        },
        {
            id: "29",
            x:  (85/360) * BASE_SIZE,
            y: (43/360) * BASE_SIZE,
            number: 29,
            rotation: 0
        },
        {
            id: "27",
            x:  (100/360) * BASE_SIZE,
            y: (43/360) * BASE_SIZE,
            number: 27,
            rotation: 0
        },
        {
            id: "35",
            x:  (94/360) * BASE_SIZE,
            y: (70/360) * BASE_SIZE,
            number: 35,
            rotation: 0
        },
        {
            id: "25",
            x:  (103/360) * BASE_SIZE,
            y: (60/360) * BASE_SIZE,
            number: 25,
            rotation: 0
        },
        {
            id: "23",
            x:  (113/360) * BASE_SIZE,
            y: (60/360) * BASE_SIZE,
            number: 23,
            rotation: 0
        },
        {
            id: "21",
            x:  (123/360) * BASE_SIZE,
            y: (60/360) * BASE_SIZE,
            number: 21,
            rotation: 0
        },
        {
            id: "11",
            x:  (90/360) * BASE_SIZE,
            y: (130/360) * BASE_SIZE,
            number: 11,
            rotation: 0
        },
        {
            id: "7",
            x:  (100/360) * BASE_SIZE,
            y: (110/360) * BASE_SIZE,
            number: 7,
            rotation: 0
        },
        {
            id: "9",
            x:  (108/360) * BASE_SIZE,
            y: (123/360) * BASE_SIZE,
            number: 9,
            rotation: 0
        },
        {
            id: "1",
            x:  (120/360) * BASE_SIZE,
            y: (110/360) * BASE_SIZE,
            number: 1,
            rotation: 0
        },
        {
            id: "3",
            x:  (124/360) * BASE_SIZE,
            y: (123/360) * BASE_SIZE,
            number: 3,
            rotation: 0
        },
        {
            id: "5",
            x:  (128/360) * BASE_SIZE,
            y: (136/360) * BASE_SIZE,
            number: 5,
            rotation: 0
        },
        {
            id: "2",
            x:  BASE_SIZE -(120/360) * BASE_SIZE,
            y: (110/360) * BASE_SIZE,
            number: 2,
            rotation: 0
        },
        {
            id: "4",
            x:  BASE_SIZE-(124/360) * BASE_SIZE,
            y: (123/360) * BASE_SIZE,
            number: 4,
            rotation: 0
        },
        {
            id: "6",
            x:  BASE_SIZE-(128/360) * BASE_SIZE,
            y: (136/360) * BASE_SIZE,
            number: 6,
            rotation: 0
        },
        {
            id: "8",
            x:  BASE_SIZE - (100/360) * BASE_SIZE,
            y: (110/360) * BASE_SIZE,
            number: 8,
            rotation: 0
        },
        {
            id: "10",
            x:  BASE_SIZE - (108/360) * BASE_SIZE,
            y: (123/360) * BASE_SIZE,
            number: 10,
            rotation: 0
        },
        {
            id: "12",
            x:  BASE_SIZE - (90/360) * BASE_SIZE,
            y: (130/360) * BASE_SIZE,
            number: 12,
            rotation: 0
        },
        {
            id: "18",
            x:  BASE_SIZE - (103/360) * BASE_SIZE,
            y: (60/360) * BASE_SIZE,
            number: 18,
            rotation: 0
        },
        {
            id: "16",
            x:  BASE_SIZE - (113/360) * BASE_SIZE,
            y: (60/360) * BASE_SIZE,
            number: 16,
            rotation: 0
        },
        {
            id: "14",
            x:  BASE_SIZE - (123/360) * BASE_SIZE,
            y: (60/360) * BASE_SIZE,
            number: 14,
            rotation: 0
        },
        {
            id: "30",
            x:  BASE_SIZE - (85/360) * BASE_SIZE,
            y: (43/360) * BASE_SIZE,
            number: 30,
            rotation: 0
        },
        {
            id: "24",
            x:  BASE_SIZE - (100/360) * BASE_SIZE,
            y: (43/360) * BASE_SIZE,
            number: 24,
            rotation: 0
        },
        {
            id: "32",
            x:  BASE_SIZE - (94/360) * BASE_SIZE,
            y: (70/360) * BASE_SIZE,
            number: 32,
            rotation: 0
        },
        {
            id: "48",
            x:  BASE_SIZE - (74/360) * BASE_SIZE,
            y: (65/360) * BASE_SIZE,
            number: 48,
            rotation: 0
        },
        {
            id: "50",
            x:  BASE_SIZE - (66/360) * BASE_SIZE,
            y: (74/360) * BASE_SIZE,
            number: 50,
            rotation: 0
        },
        {
            id: "46",
            x:  BASE_SIZE - (49/360) * BASE_SIZE,
            y: (63/360) * BASE_SIZE,
            number: 46,
            rotation: 0
        },
        {
            id: "44",
            x:  BASE_SIZE - (58/360) * BASE_SIZE,
            y: (55/360) * BASE_SIZE,
            number: 44,
            rotation: 0
        },
        {
            id: "38",
            x:  BASE_SIZE - (66/360) * BASE_SIZE,
            y: (48/360) * BASE_SIZE,
            number: 38,
            rotation: 0
        },
        {
            id: "42",
            x:  BASE_SIZE - (38/360) * BASE_SIZE,
            y: (48/360) * BASE_SIZE,
            number: 42,
            rotation: 0
        },
        {
            id: "40",
            x:  BASE_SIZE - (46/360) * BASE_SIZE,
            y: (42/360) * BASE_SIZE,
            number: 40,
            rotation: 0
        }
    ];
  }

const INITIAL_STATE = generateShapes();

// Floor map with the guest's table circled. Pass `table`, or it reads ?table=.
export default class SeatingMap extends React.Component {

    constructor(props) {
        super(props);
        let urlParams = new URLSearchParams(window.location.search);
        this.scroller = React.createRef();
        this.state = ({
            tables: INITIAL_STATE,
            table: String(props.table ?? urlParams.get('table') ?? ""),
            // Which door the guest scanned in at (from their door's QR code).
            door: String(props.door ?? getDoor() ?? ""),
            wider: false
        })
    }

    componentDidMount() {
        window.addEventListener("resize", this.onWindowResize);
        this.centerOnTable();
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.onWindowResize);
    }

    // On screens narrower than the map, scroll so the guest's table is in view.
    centerOnTable = () => {
        const box = this.scroller.current;
        if (!box) return;
        const wider = box.scrollWidth > box.clientWidth + 1;
        if (wider !== this.state.wider) this.setState({ wider });
        const mine = this.state.tables.find(t => String(t.number) === this.state.table);
        if (wider && mine) box.scrollLeft = mine.x - box.clientWidth / 2;
    }

    onWindowResize = () => {
        clearTimeout(this.resizeLag)
        this.resizeLag = setTimeout(() => {
            BASE_SIZE = getWidth()
            this.setState({ tables: generateShapes() }, this.centerOnTable)
        }, 200)
    }

    render() {
       let tables = this.state.tables
       const mine = tables.find(t => String(t.number) === this.state.table)
        return (
            <React.Fragment>
                <div ref={this.scroller} className="overflow-x-auto overscroll-x-contain rounded-2xl border border-white/10 shadow-2xl shadow-black/40" style={{ maxWidth: BASE_SIZE + 2, margin: "0 auto" }}>
                <Stage style={{pointerEvents: "none", backgroundColor: "#fafaf9", width: BASE_SIZE}} width={BASE_SIZE} height={BASE_SIZE * .55}>
                    <Layer style={{ overflow: "auto"}}>
                        <Rect
                            x={(4/360) * BASE_SIZE}
                            y={(4/360) * BASE_SIZE}
                            width={(15/360) * BASE_SIZE}
                            height={(60/360) * BASE_SIZE}
                            fill="#292524"
                        />
                        <Rect
                            x={(4/360) * BASE_SIZE}
                            y={(4/360) * BASE_SIZE}
                            width={(60/360) * BASE_SIZE}
                            height={(15/360) * BASE_SIZE}
                            fill="#292524"
                        />
                        <Rect
                            x={(4/360) * BASE_SIZE}
                            y={(50/360) * BASE_SIZE}
                            width={(50/360) * BASE_SIZE}
                            height={(7/360) * BASE_SIZE}
                            rotation={-45}
                            fill="#292524"
                        />
                        <Rect
                            x={BASE_SIZE - (19/360) * BASE_SIZE}
                            y={(4/360) * BASE_SIZE}
                            width={(15/360) * BASE_SIZE}
                            height={(60/360) * BASE_SIZE}
                            fill="#292524"
                        />
                        <Rect
                            x={BASE_SIZE - (64/360) * BASE_SIZE}
                            y={(4/360) * BASE_SIZE}
                            width={(60/360) * BASE_SIZE}
                            height={(15/360) * BASE_SIZE}
                            fill="#292524"
                        />
                        <Rect
                            x={BASE_SIZE - (50/360) * BASE_SIZE}
                            y={(4/360) * BASE_SIZE}
                            width={(50/360) * BASE_SIZE}
                            height={(7/360) * BASE_SIZE}
                            rotation={45}
                            fill="#292524"
                        />
                        <Rect
                            x={(BASE_SIZE) / 2 - (45/360) * BASE_SIZE}
                            y={(4/360) * BASE_SIZE}
                            width={(90/360) * BASE_SIZE}
                            height={(92.5/360) * BASE_SIZE}
                            fill="#292524"
                        />
                        <Line
                            points={[(4/360) * BASE_SIZE, (4/360) * BASE_SIZE - 2.5,
                                (4/360) * BASE_SIZE, BASE_SIZE * .55 - (4/360) * BASE_SIZE,
                                BASE_SIZE /4 -(45/360) * BASE_SIZE, BASE_SIZE * .55 -(4/360) * BASE_SIZE,
                                BASE_SIZE /4 -(45/360) * BASE_SIZE, BASE_SIZE * .55 -(18/360) * BASE_SIZE,
                                BASE_SIZE /2 -(45/360) * BASE_SIZE, BASE_SIZE * .55 -(18/360) * BASE_SIZE,
                                BASE_SIZE /2 - (20/360) * BASE_SIZE, BASE_SIZE * .55,
                            ]}
                            stroke='#292524'
                            strokeWidth={5}
                            closed= {false}
                        />
                        <Line
                            points={[(4/360) * BASE_SIZE,(4/360) * BASE_SIZE, BASE_SIZE - (4/360) * BASE_SIZE, (4/360) * BASE_SIZE,
                                BASE_SIZE - (4/360) * BASE_SIZE, BASE_SIZE * .55 - (4/360) * BASE_SIZE,
                                BASE_SIZE * 3 /4 +(45/360) * BASE_SIZE, BASE_SIZE * .55 -(4/360) * BASE_SIZE,
                                BASE_SIZE * 3  /4 +(45/360) * BASE_SIZE, BASE_SIZE * .55 -(18/360) * BASE_SIZE,
                                BASE_SIZE  /2 +(45/360) * BASE_SIZE, BASE_SIZE * .55 -(18/360) * BASE_SIZE,
                                BASE_SIZE /2 + (20/360) * BASE_SIZE, BASE_SIZE * .55,
                            ]}
                            stroke='#292524'
                            strokeWidth={5}
                            closed= {false}
                        />
                        <Line
                            points={[BASE_SIZE - (32/360) * BASE_SIZE, (42/360) * BASE_SIZE,
                                BASE_SIZE - (30/360) * BASE_SIZE, (50/360) * BASE_SIZE,
                                BASE_SIZE - (63/360) * BASE_SIZE, (85/360) * BASE_SIZE,
                                BASE_SIZE - (74/360) * BASE_SIZE, (85/360) * BASE_SIZE,
                                BASE_SIZE - (83/360) * BASE_SIZE, (74/360) * BASE_SIZE,
                                BASE_SIZE - (80/360) * BASE_SIZE, (65/360) * BASE_SIZE,
                                BASE_SIZE - (50/360) * BASE_SIZE, (34/360) * BASE_SIZE,
                                BASE_SIZE - (42/360) * BASE_SIZE, (34/360) * BASE_SIZE,
                                BASE_SIZE - (31/360) * BASE_SIZE, (43/360) * BASE_SIZE]}
                            stroke='#292524'
                            strokeWidth={(5/360) * BASE_SIZE}
                            closed= {false}
                        />
                        <Line
                            points={[(32/360) * BASE_SIZE, (42/360) * BASE_SIZE,
                            (30/360) * BASE_SIZE, (50/360) * BASE_SIZE,
                            (63/360) * BASE_SIZE, (85/360) * BASE_SIZE,
                            (74/360) * BASE_SIZE, (85/360) * BASE_SIZE,
                            (83/360) * BASE_SIZE, (74/360) * BASE_SIZE,
                            (80/360) * BASE_SIZE, (65/360) * BASE_SIZE,
                            (50/360) * BASE_SIZE, (34/360) * BASE_SIZE,
                            (42/360) * BASE_SIZE, (34/360) * BASE_SIZE,
                            (31/360) * BASE_SIZE, (43/360) * BASE_SIZE]}
                            stroke='#292524'
                            strokeWidth={(5/360) * BASE_SIZE}
                            closed= {false}
                        />
                        <Line
                            points={[BASE_SIZE * .55 * 3 / 8, BASE_SIZE * .55 -(18/360) * BASE_SIZE,
                            BASE_SIZE * .55 * 3 / 8, BASE_SIZE * .35
                            ]}
                            stroke='#292524'
                            strokeWidth={(5/360) * BASE_SIZE}
                            closed= {false}
                        />
                        <Line
                            points={[
                            BASE_SIZE * .55 * 3 / 8, BASE_SIZE * .35,
                            (BASE_SIZE * .55 * 3 / 8) - (10/360) * BASE_SIZE + ((BASE_SIZE / 2 - (45/360) * BASE_SIZE) - (BASE_SIZE * .55 * 3 / 8)) / 2 - ((19/360) * BASE_SIZE), (94/360) * BASE_SIZE - (15/360) * BASE_SIZE + (BASE_SIZE * .35 - (94/360) * BASE_SIZE) /2 + ((19/360) * BASE_SIZE),
                            (BASE_SIZE * .55 * 3 / 8) - (10/360) * BASE_SIZE + ((BASE_SIZE / 2 - (45/360) * BASE_SIZE) - (BASE_SIZE * .55 * 3 / 8)) / 2 - ((18/360) * BASE_SIZE), (94/360) * BASE_SIZE - (15/360) * BASE_SIZE + (BASE_SIZE * .35 - (94/360) * BASE_SIZE) /2 + ((16/360) * BASE_SIZE),
                            (BASE_SIZE * .55 * 3 / 8) - (10/360) * BASE_SIZE + ((BASE_SIZE / 2 - (45/360) * BASE_SIZE) - (BASE_SIZE * .55 * 3 / 8)) / 2 - ((17/360) * BASE_SIZE), (94/360) * BASE_SIZE - (15/360) * BASE_SIZE + (BASE_SIZE * .35 - (94/360) * BASE_SIZE) /2 + ((13/360) * BASE_SIZE),
                            (BASE_SIZE * .55 * 3 / 8) - (10/360) * BASE_SIZE + ((BASE_SIZE / 2 - (45/360) * BASE_SIZE) - (BASE_SIZE * .55 * 3 / 8)) / 2 - ((15/360) * BASE_SIZE), (94/360) * BASE_SIZE - (15/360) * BASE_SIZE + (BASE_SIZE * .35 - (94/360) * BASE_SIZE) /2 + ((10/360) * BASE_SIZE),
                            (BASE_SIZE * .55 * 3 / 8) - (10/360) * BASE_SIZE + ((BASE_SIZE / 2 - (45/360) * BASE_SIZE) - (BASE_SIZE * .55 * 3 / 8)) / 2 - ((10/360) * BASE_SIZE), (94/360) * BASE_SIZE - (15/360) * BASE_SIZE + (BASE_SIZE * .35 - (94/360) * BASE_SIZE) /2 + ((5/360) * BASE_SIZE),
                            (BASE_SIZE * .55 * 3 / 8) - (10/360) * BASE_SIZE + ((BASE_SIZE / 2 - (45/360) * BASE_SIZE) - (BASE_SIZE * .55 * 3 / 8)) / 2, (94/360) * BASE_SIZE - (15/360) * BASE_SIZE + (BASE_SIZE * .35 - (94/360) * BASE_SIZE) /2,
                            (BASE_SIZE) / 2 - (45/360) * BASE_SIZE, (94/360) * BASE_SIZE
                            ]}
                            tension={.4}
                            stroke='#292524'
                            strokeWidth={(5/360) * BASE_SIZE}
                            closed= {false}
                        />
                        
                        <Line
                            points={[
                            BASE_SIZE * .55 * 3/2 - (10/360) * BASE_SIZE, BASE_SIZE * .35 + (2/360) * BASE_SIZE,
                            BASE_SIZE * .55 * 3/2 - (12/360) * BASE_SIZE, BASE_SIZE * .35 - (10/360) * BASE_SIZE,
                            BASE_SIZE * .55 * 3/2 - (15/360) * BASE_SIZE, BASE_SIZE * .35 - (19/360) * BASE_SIZE,
                            BASE_SIZE * .55 * 3/2 - (17/360) * BASE_SIZE, BASE_SIZE * .35 - (23/360) * BASE_SIZE,
                            BASE_SIZE * .55 * 3/2 - (20/360) * BASE_SIZE, BASE_SIZE * .35 - (26/360) * BASE_SIZE,
                            BASE_SIZE * .55 * 3/2 - (23/360) * BASE_SIZE, BASE_SIZE * .35 - (28/360) * BASE_SIZE,
                            (BASE_SIZE / 2 + (45/360) * BASE_SIZE + (10/360) * BASE_SIZE) + ((BASE_SIZE * .55 * 3/2 - (10/360) * BASE_SIZE) - (BASE_SIZE / 2 + (45/360) * BASE_SIZE)) /2, (94/360) * BASE_SIZE - (15/360) * BASE_SIZE + (BASE_SIZE * .35 - (94/360) * BASE_SIZE) /2,
                            (BASE_SIZE) / 2 + (45/360) * BASE_SIZE, (94/360) * BASE_SIZE
                            ]}
                            tension={.4}
                            stroke='#292524'
                            strokeWidth={(5/360) * BASE_SIZE}
                            closed= {false}
                        />
                        
                        <Line
                            points={[BASE_SIZE * .55 * 3/2 - (10/360) * BASE_SIZE, BASE_SIZE * .55 -(18/360) * BASE_SIZE,
                            BASE_SIZE * .55 * 3/2 - (10.2/360) * BASE_SIZE, BASE_SIZE * .35 
                            ]}
                            stroke='#292524'
                            tension = {99}
                            strokeWidth={(5/360) * BASE_SIZE}
                            closed= {false}
                        />
                        <Line
                            points={[
                            BASE_SIZE * .55 * 3/2 - (10/360) * BASE_SIZE, BASE_SIZE * .35 + (2/360) * BASE_SIZE,
                            BASE_SIZE * .55 * 3/2 - (12/360) * BASE_SIZE, BASE_SIZE * .35 - (10/360) * BASE_SIZE,
                            BASE_SIZE * .55 * 3/2 - (15/360) * BASE_SIZE, BASE_SIZE * .35 - (19/360) * BASE_SIZE,
                            BASE_SIZE * .55 * 3/2 - (17/360) * BASE_SIZE, BASE_SIZE * .35 - (23/360) * BASE_SIZE,
                            BASE_SIZE * .55 * 3/2 - (20/360) * BASE_SIZE, BASE_SIZE * .35 - (26/360) * BASE_SIZE,
                            BASE_SIZE * .55 * 3/2 - (23/360) * BASE_SIZE, BASE_SIZE * .35 - (28/360) * BASE_SIZE,
                            (BASE_SIZE / 2 + (45/360) * BASE_SIZE + (10/360) * BASE_SIZE) + ((BASE_SIZE * .55 * 3/2 - (10/360) * BASE_SIZE) - (BASE_SIZE / 2 + (45/360) * BASE_SIZE)) /2, (94/360) * BASE_SIZE - (15/360) * BASE_SIZE + (BASE_SIZE * .35 - (94/360) * BASE_SIZE) /2,
                            (BASE_SIZE) / 2 + (45/360) * BASE_SIZE, (94/360) * BASE_SIZE
                            ]}
                            tension={.4}
                            stroke='#292524'
                            strokeWidth={(5/360) * BASE_SIZE}
                            closed= {false}
                        />
                    </Layer>
                    <Layer style={{overflow: "auto"}}>
                        {tables.map((table) => {
                        const isMine = table === mine
                        const r = (5/360) * BASE_SIZE
                        return (
                            <Group
                                key={table.id}
                                id={table.id}
                            >
                                <Circle
                                    x={table.x}
                                    y={table.y}
                                    radius={r}
                                    fill={isMine ? '#FFC72C' : '#e5e7eb'}
                                    stroke={'#292524'}
                                    strokeWidth={(isMine ? 1.5 : 1)/360 * BASE_SIZE}
                                    fillAfterStrokeEnabled={true}
                                />
                                <Text
                                    x={table.x - r}
                                    y={table.y - r}
                                    width={r * 2}
                                    height={r * 2}
                                    fontStyle={"bold"}
                                    fontSize={(5.5/360) * BASE_SIZE}
                                    text={String(table.number)}
                                    fill="#0B0F17"
                                    align="center"
                                    verticalAlign="middle"
                                />
                            </Group>
                        );
                        })}
                        {mine && (
                            <HandDrawnCircle
                                x={mine.x}
                                y={mine.y}
                                radius={(9/360) * BASE_SIZE}
                                seed={mine.number}
                                strokeWidth={Math.max(2.5, (1.6/360) * BASE_SIZE)}
                            />
                        )}
                        {/* The door this guest scanned in at; positions are in src/lib/doors.json. */}
                        {DOORS[this.state.door] && (
                            <YouAreHere
                                x={(DOORS[this.state.door].x / 360) * BASE_SIZE}
                                y={(DOORS[this.state.door].y / 360) * BASE_SIZE}
                                unit={BASE_SIZE / 360}
                                label={DOORS[this.state.door].label}
                            />
                        )}
                    </Layer>
                </Stage>
                </div>
                {this.state.wider && (
                    <p className="mt-2 text-center text-xs text-slate-400">Swipe sideways to see the whole room</p>
                )}
            </React.Fragment>
        );
    }
}