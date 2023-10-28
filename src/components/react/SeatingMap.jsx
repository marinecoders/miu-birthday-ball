import React from "react";
import { Stage, Layer, Star, Circle, Group, Text, Label, Rect, Line } from 'react-konva';
import 'react-select-search/style.css'


function generateShapes() {
    return [
        {
            id: "33",
            x: 70,
            y: 24,
            number: 33,
            rotation: 0,
            star: false
        },
        {
            id: "31",
            x: 82,
            y: 24,
            number: 31,
            rotation: 0,
            star: false
        },
        {
            id: "19",
            x: 94,
            y: 24,
            number: 19,
            rotation: 0,
            star: false
        },
        {
            id: "17",
            x: 106,
            y: 24,
            number: 17,
            rotation: 0,
            star: false
        },
        {
            id: "15",
            x: 118,
            y: 24,
            number: 15,
            rotation: 0,
            star: false
        },
        {
            id: "13",
            x: 129,
            y: 24,
            number: 13,
            rotation: 0,
            star: false
        },
        {
            id: "36",
            x: 360 - 70,
            y: 24,
            number: 36,
            rotation: 0,
            star: false
        },
        {
            id: "34",
            x: 360 - 82,
            y: 24,
            number: 34,
            rotation: 0,
            star: false
        },
        {
            id: "28",
            x:  360 - 94,
            y: 24,
            number: 28,
            rotation: 0,
            star: false
        },
        {
            id: "26",
            x:  360 - 106,
            y: 24,
            number: 26,
            rotation: 0,
            star: false
        },
        {
            id: "22",
            x:  360 - 118,
            y: 24,
            number: 22,
            rotation: 0,
            star: false
        },
        {
            id: "20",
            x:  360 - 129,
            y: 24,
            number: 20,
            rotation: 0,
            star: false
        },
        {
            id: "41",
            x:  38,
            y: 48,
            number: 41,
            rotation: 0,
            star: false
        },
        {
            id: "37",
            x:  46,
            y: 42,
            number: 37,
            rotation: 0,
            star: false
        },
        {
            id: "43",
            x:  49,
            y: 63,
            number: 43,
            rotation: 0,
            star: false
        },
        {
            id: "45",
            x:  58,
            y: 55,
            number: 45,
            rotation: 0,
            star: false
        },
        {
            id: "39",
            x:  66,
            y: 48,
            number: 39,
            rotation: 0,
            star: false
        },
        {
            id: "49",
            x:  74,
            y: 65,
            number: 49,
            rotation: 0,
            star: false
        },
        {
            id: "47",
            x:  66,
            y: 74,
            number: 47,
            rotation: 0,
            star: false
        },
        {
            id: "29",
            x:  85,
            y: 43,
            number: 29,
            rotation: 0,
            star: false
        },
        {
            id: "27",
            x:  100,
            y: 43,
            number: 27,
            rotation: 0,
            star: false
        },
        {
            id: "35",
            x:  94,
            y: 70,
            number: 35,
            rotation: 0,
            star: false
        },
        {
            id: "25",
            x:  103,
            y: 60,
            number: 25,
            rotation: 0,
            star: false
        },
        {
            id: "23",
            x:  113,
            y: 60,
            number: 23,
            rotation: 0,
            star: false
        },
        {
            id: "21",
            x:  123,
            y: 60,
            number: 21,
            rotation: 0,
            star: false
        },
        {
            id: "11",
            x:  90,
            y: 130,
            number: 11,
            rotation: 0,
            star: false
        },
        {
            id: "7",
            x:  100,
            y: 110,
            number: 7,
            rotation: 0,
            star: false
        },
        {
            id: "9",
            x:  108,
            y: 123,
            number: 9,
            rotation: 0,
            star: false
        },
        {
            id: "1",
            x:  120,
            y: 110,
            number: 1,
            rotation: 0,
            star: false
        },
        {
            id: "3",
            x:  124,
            y: 123,
            number: 3,
            rotation: 0,
            star: false
        },
        {
            id: "5",
            x:  128,
            y: 136,
            number: 5,
            rotation: 0,
            star: false
        },
        {
            id: "2",
            x:  360 -120,
            y: 110,
            number: 2,
            rotation: 0,
            star: false
        },
        {
            id: "4",
            x:  360-124,
            y: 123,
            number: 4,
            rotation: 0,
            star: false
        },
        {
            id: "6",
            x:  360-128,
            y: 136,
            number: 6,
            rotation: 0,
            star: false
        },
        {
            id: "8",
            x:  360 - 100,
            y: 110,
            number: 8,
            rotation: 0,
            star: false
        },
        {
            id: "10",
            x:  360 - 108,
            y: 123,
            number: 10,
            rotation: 0,
            star: false
        },
        {
            id: "12",
            x:  360 - 90,
            y: 130,
            number: 12,
            rotation: 0,
            star: false
        },
        {
            id: "18",
            x:  360 - 103,
            y: 60,
            number: 18,
            rotation: 0,
            star: false
        },
        {
            id: "16",
            x:  360 - 113,
            y: 60,
            number: 16,
            rotation: 0,
            star: false
        },
        {
            id: "14",
            x:  360 - 123,
            y: 60,
            number: 14,
            rotation: 0,
            star: false
        },
        {
            id: "30",
            x:  360 - 85,
            y: 43,
            number: 30,
            rotation: 0,
            star: false
        },
        {
            id: "24",
            x:  360 - 100,
            y: 43,
            number: 24,
            rotation: 0,
            star: false
        },
        {
            id: "32",
            x:  360 - 94,
            y: 70,
            number: 32,
            rotation: 0,
            star: false
        },
        {
            id: "50",
            x:  360 - 74,
            y: 65,
            number: 50,
            rotation: 0,
            star: false
        },
        {
            id: "48",
            x:  360 - 66,
            y: 74,
            number: 48,
            rotation: 0,
            star: false
        },
        {
            id: "46",
            x:  360 - 49,
            y: 63,
            number: 46,
            rotation: 0,
            star: false
        },
        {
            id: "44",
            x:  360 - 58,
            y: 55,
            number: 44,
            rotation: 0,
            star: false
        },
        {
            id: "38",
            x:  360 - 66,
            y: 48,
            number: 38,
            rotation: 0,
            star: false
        },
        {
            id: "42",
            x:  360 - 38,
            y: 48,
            number: 42,
            rotation: 0,
            star: false
        },
        {
            id: "40",
            x:  360 - 46,
            y: 42,
            number: 40,
            rotation: 0,
            star: false
        }
    ];
  }
  
const INITIAL_STATE = generateShapes();

export default class DropDown extends React.Component {


    constructor() {
        super();
        let queryString = window.location.search;
        let urlParams = new URLSearchParams(queryString);
        let number = urlParams.get('table')
        for (let table of INITIAL_STATE) {
            if (table.number == number) {
                table.star = true
            }
        }
        this.state = ({
            tables: INITIAL_STATE,
            landscape: false,
            table: number
        })


          
        window.addEventListener("resize",  this.onWindowResize);
    }

    isLandscape = () => window.matchMedia('(orientation:landscape)').matches
    onWindowResize = () => {              
        clearTimeout(window.resizeLag)
        window.resizeLag = setTimeout(() => {
          delete window.resizeLag
        this.setState({
            landscape: this.isLandscape()
        })
        }, 200)
    }


    render() {
        let tables = this.state.tables
        if (this.state.landscape) {
            return (
                <div className="max-w-3xl mx-auto mt-5 text-center">
                    <p className="text-lg text-slate-600 dark:text-slate-400">
                        Please rotate phone to portrait
                    </p>
                </div>
            )
        }
        return (
            <React.Fragment>
                <div className="max-w-3xl mx-auto mt-5 mb-24 text-center">
                    <p className="text-lg text-slate-600 dark:text-slate-400">
                        Your table is starred in the map below
                    </p>
                </div>
                <div className="flex justify-center">
                <Stage style={{overflow: "auto"}} width={360} height={360 * .55}>
                    <Layer style={{overflow: "auto"}}>
                        <Rect
                            x={4}
                            y={4}
                            width={15}
                            height={60}
                            fill="white"
                        />
                        <Rect
                            x={4}
                            y={4}
                            width={60}
                            height={15}
                            fill="white"
                        />
                        <Rect
                            x={4}
                            y={50}
                            width={50}
                            height={7}
                            rotation={-45}
                            fill="white"
                        />
                        <Rect
                            x={360 - 19}
                            y={4}
                            width={15}
                            height={60}
                            fill="white"
                        />
                        <Rect
                            x={360 - 64}
                            y={4}
                            width={60}
                            height={15}
                            fill="white"
                        />
                        <Rect
                            x={360 - 50}
                            y={4}
                            width={50}
                            height={7}
                            rotation={45}
                            fill="white"
                        />
                        <Rect
                            x={(360) / 2 - 45}
                            y={4}
                            width={90}
                            height={90}
                            fill="white"
                        />
                        <Line
                            points={[4, 4,
                                4, 360 * .55 - 4,
                                360 /4 -45, 360 * .55 -4,
                                360 /4 -45, 360 * .55 -18,
                                360 /2 -45, 360 * .55 -18,
                                360 /2 - 20, 360 * .55,
                            ]}
                            stroke='black'
                            strokeWidth={5}
                            closed= {false}
                        />
                        <Line
                            points={[4,4, 360 - 4, 4,
                                360 - 4, 360 * .55 - 4,
                                360 * 3 /4 +45, 360 * .55 -4,
                                360 * 3  /4 +45, 360 * .55 -18,
                                360  /2 +45, 360 * .55 -18,
                                360 /2 + 20, 360 * .55,
                            ]}
                            stroke='black'
                            strokeWidth={5}
                            closed= {false}
                        />
                        <Line
                            points={[360 - 32, 42, 360 - 30, 50, 360 - 63, 85, 360 - 74, 85, 360 - 83, 74, 360 - 80, 65, 360 - 50, 34, 360 - 42, 34, 360 - 31, 43]}
                            stroke='black'
                            strokeWidth={5}
                            closed= {false}
                        />
                        <Line
                            points={[32, 42, 30, 50, 63, 85, 74, 85, 83, 74, 80, 65, 50, 34, 42, 34, 31, 43]}
                            stroke='black'
                            strokeWidth={5}
                            closed= {false}
                        />
                        <Line
                            points={[360 * .55 * 3 / 8, 360 * .55 -18,
                            360 * .55 * 3 / 8, 360 * .35
                            ]}
                            stroke='black'
                            strokeWidth={5}
                            closed= {false}
                        />
                        <Line
                            points={[
                            360 * .55 * 3 / 8, 360 * .35,
                            (360 * .55 * 3 / 8) - 10 + ((360 / 2 - 45) - (360 * .55 * 3 / 8)) / 2, 94 - 15 + (360 * .35 - 94) /2,
                            (360) / 2 - 45, 94
                            ]}
                            tension={.4}
                            stroke='black'
                            strokeWidth={5}
                            closed= {false}
                        />
                        
                        <Line
                            points={[360 * .55 * 3/2 - 10, 360 * .55 -18,
                            360 * .55 * 3/2 - 10, 360 * .35
                            ]}
                            stroke='black'
                            strokeWidth={5}
                            closed= {false}
                        />
                        <Line
                            points={[
                            360 * .55 * 3/2 - 10, 360 * .35,
                            (360 / 2 + 45 + 10) + ((360 * .55 * 3/2 - 10) - (360 / 2 + 45)) /2, 94 - 15 + (360 * .35 - 94) /2,
                            (360) / 2 + 45, 94
                            ]}
                            tension={.4}
                            stroke='black'
                            strokeWidth={5}
                            closed= {false}
                        />
                    </Layer>
                    <Layer style={{overflow: "auto"}}>
                        {tables.map((table) => {
                        if (table.star) {
                            return (
                                <Star
                                    key={table.id}
                                    id={table.id}
                                    x={table.x}
                                    y={table.y}
                                    numPoints={5}
                                    innerRadius={3}
                                    outerRadius={7}
                                    opacity={0.8}
                                    rotation={table.rotation}
                                    fill={'red'}
                                    shadowBlur={10}
                                    shadowOpacity={0.6}
                                />
                            );
                        }
                        return (
                            <Group
                                key={table.id}
                                id={table.id}
                                x={table.x}
                                y={table.y}
                            >
                                <Circle
                                    key={table.id}
                                    id={table.id}
                                    radius={5}
                                    fill={'gray'}
                                    stroke={'black'}
                                    strokeWidth={2}
                                />
                                <Text width={5} fontSize={2} text={table.number} fill="#000000" wrap="char" align="left" />
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