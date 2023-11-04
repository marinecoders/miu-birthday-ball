import React from "react";
import { Stage, Layer, Star, Circle, Group, Text, Label, Rect, Line } from 'react-konva';
import 'react-select-search/style.css'


function getWidth() {
    if (window.innerHeight >= (window.innerWidth * .55 - 68)) {
        return window.innerWidth;
    }
    return (window.innerHeight / .55)
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

function isLandscape() {return window.matchMedia('(orientation:landscape)').matches}

const INITIAL_STATE = generateShapes();

export default class DropDown extends React.Component {


    constructor() {
        super();
        let queryString = window.location.search;
        let urlParams = new URLSearchParams(queryString);
        let number = urlParams.get('table')
        console.log(isLandscape())
        this.state = ({
            tables: INITIAL_STATE,
            landscape: isLandscape(),
            table: number
        })

        window.addEventListener("resize",  this.onWindowResize);
    }


    onWindowResize = () => {              
        clearTimeout(window.resizeLag)
        window.resizeLag = setTimeout(() => {
          delete window.resizeLag
        BASE_SIZE = getWidth()
        this.setState({
            landscape: isLandscape(),
            tables: generateShapes()
        })
        }, 200)
    }

    getHeader = () => {
        if (!this.state.landscape) {
            return (
                <div className="max-w-3xl mx-auto mt-5 mb-12 text-center">
                    <p className="text-lg text-slate-600 dark:text-slate-400">
                        Your table is starred in the map below
                    </p>
                </div>
            );
        }
        return null;
    }


    render() {
       let tables = this.state.tables
        return (
            <React.Fragment>
                {
                   this.getHeader()
                }
                
                <div className="flex justify-center">
                <Stage style={{pointerEvents: "none", backgroundColor: "#fafaf9", overflow: "auto"}} width={BASE_SIZE} height={BASE_SIZE * .55}>
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
                        if (table.number == this.state.table) {
                            return (
                                <Star
                                    key={table.id}
                                    id={table.id}
                                    x={table.x}
                                    y={table.y}
                                    numPoints={5}
                                    innerRadius={(3/360) * BASE_SIZE}
                                    outerRadius={(7/360) * BASE_SIZE}
                                    opacity={(0.8/360) * BASE_SIZE}
                                    rotation={table.rotation}
                                    fill={'#991b1b'}
                                />
                            );
                        }
                        return (
                            <Group
                                key={table.id}
                                id={table.id}
                            >
                                <Circle
                                    x={table.x}
                                    y={table.y}
                                    key={table.id}
                                    id={table.id}
                                    radius={(5/360) * BASE_SIZE}
                                    fill={'#e5e7eb'}
                                    stroke={'#292524'}
                                    strokeWidth={(1/360) * BASE_SIZE}
                                    fillAfterStrokeEnabled={true}
                                />
                                <Text
                                    x={table.x-(table.number < 10 ? (1.5/360) * BASE_SIZE : (3/360) * BASE_SIZE)}
                                    y={table.y-(2/360) * BASE_SIZE}
                                    fontStyle={"bold"} 
                                    fontSize={(6/360) * BASE_SIZE} 
                                    text={table.number} 
                                    fill="#000000" 
                                    wrap="char" 
                                    verticalAlign="top"
                                    align="left" 
                                />
                            </Group>
                        );
                        })}
                    </Layer>
                </Stage>
                </div>
            </React.Fragment>
        );
    }
}