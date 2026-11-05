import React from "react";
import { Circle, Group, Line, Rect, Text } from "react-konva";

export default function RestroomMarker({ landmark, scale }) {
    const { x, y, radius, guide } = landmark;
    const labelY = (guide[1] + guide.at(-1)) / 2;
    return <Group id="restrooms" listening={false}>
        <Line points={guide} stroke="#94a3b8" strokeWidth={0.7} dash={[2, 2]} />
        <Group x={x} y={y} scaleX={radius / 10} scaleY={radius / 10}>
            <Circle radius={10} fill="#334155" />
            <Line points={[0, -6, 0, 6]} stroke="#ffffff" strokeWidth={0.5} opacity={0.6} />
            <Circle x={-4} y={-4.5} radius={1.2} fill="#ffffff" />
            <Rect x={-5.5} y={-2.5} width={3} height={4.5} cornerRadius={0.6} fill="#ffffff" />
            <Line points={[-4.8, 1, -4.8, 5.5]} stroke="#ffffff" strokeWidth={1.1} lineCap="round" />
            <Line points={[-3.2, 1, -3.2, 5.5]} stroke="#ffffff" strokeWidth={1.1} lineCap="round" />
            <Circle x={4} y={-4.5} radius={1.2} fill="#ffffff" />
            <Line points={[4, -2.5, 1.4, 2.5, 6.6, 2.5]} fill="#ffffff" closed />
            <Line points={[3.2, 2, 3.2, 5.5]} stroke="#ffffff" strokeWidth={1.1} lineCap="round" />
            <Line points={[4.8, 2, 4.8, 5.5]} stroke="#ffffff" strokeWidth={1.1} lineCap="round" />
        </Group>
        {/* Keep the vertical label readable even in a phone's whole-room view. */}
        <Text x={x - 13.5 / scale} y={labelY + 45 / scale}
            width={90 / scale} height={12 / scale} rotation={-90}
            text="RESTROOMS" fontSize={9 / scale} fontFamily="Arial, sans-serif"
            fill="#64748b" align="center" verticalAlign="middle" wrap="none" />
    </Group>;
}
