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
            {/* Standard restroom pictogram: each figure has arms at its sides,
                separated from the body by a small gap. */}
            <Group id="restroom-man">
                <Circle x={-4.2} y={-4.5} radius={1.2} fill="#ffffff" />
                <Rect x={-5.35} y={-2.6} width={2.3} height={4.3} cornerRadius={0.6} fill="#ffffff" />
                <Line points={[-6.25, -2.1, -6.25, 1.2]} stroke="#ffffff" strokeWidth={0.9} lineCap="round" />
                <Line points={[-2.15, -2.1, -2.15, 1.2]} stroke="#ffffff" strokeWidth={0.9} lineCap="round" />
                <Line points={[-4.8, 1.5, -4.8, 5.5]} stroke="#ffffff" strokeWidth={1.1} lineCap="round" />
                <Line points={[-3.6, 1.5, -3.6, 5.5]} stroke="#ffffff" strokeWidth={1.1} lineCap="round" />
            </Group>
            <Group id="restroom-woman">
                <Circle x={4.2} y={-4.5} radius={1.2} fill="#ffffff" />
                <Line points={[3.5, -2.6, 4.9, -2.6, 6.4, 2.8, 2.0, 2.8]} fill="#ffffff" closed
                    lineJoin="round" stroke="#ffffff" strokeWidth={0.3} />
                <Line points={[2.6, -2.1, 2.05, 0.4]} stroke="#ffffff" strokeWidth={0.9} lineCap="round" />
                <Line points={[5.8, -2.1, 6.35, 0.4]} stroke="#ffffff" strokeWidth={0.9} lineCap="round" />
                <Line points={[3.6, 2.6, 3.6, 5.5]} stroke="#ffffff" strokeWidth={1.1} lineCap="round" />
                <Line points={[4.8, 2.6, 4.8, 5.5]} stroke="#ffffff" strokeWidth={1.1} lineCap="round" />
            </Group>
        </Group>
        {/* Keep the vertical label readable even in a phone's whole-room view. */}
        <Text x={x - 13.5 / scale} y={labelY + 45 / scale}
            width={90 / scale} height={12 / scale} rotation={-90}
            text="RESTROOMS" fontSize={9 / scale} fontFamily="Arial, sans-serif"
            fill="#64748b" align="center" verticalAlign="middle" wrap="none" />
    </Group>;
}
