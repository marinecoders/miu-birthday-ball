import React, { useEffect, useRef } from "react";
import Konva from "konva";
import { Group, Circle, Label, Tag, Text } from "react-konva";

// "You are here" pin: a blue dot with a soft pulsing ring and a label above.
// `unit` is one map unit (the map is 360 units wide).
export default function YouAreHere({ x, y, unit }) {
    const ring = useRef(null);

    useEffect(() => {
        const node = ring.current;
        if (!node || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        const layer = node.getLayer();
        const anim = new Konva.Animation((frame) => {
            const t = (frame.time % 1800) / 1800; // one pulse every 1.8 s
            node.scale({ x: 1 + t * 1.6, y: 1 + t * 1.6 });
            node.opacity(0.55 * (1 - t));
        }, layer);
        anim.start();
        return () => anim.stop();
    }, []);

    const dot = 3 * unit;
    return (
        <Group listening={false}>
            <Circle ref={ring} x={x} y={y} radius={dot} fill="#2563EB" opacity={0.5} />
            <Circle x={x} y={y} radius={dot} fill="#2563EB" stroke="#ffffff" strokeWidth={Math.max(1.5, 0.8 * unit)} />
            <Label x={x} y={y - dot - 1.5 * unit}>
                <Tag
                    fill="#1E3A8A"
                    pointerDirection="down"
                    pointerWidth={4 * unit}
                    pointerHeight={2.5 * unit}
                    cornerRadius={2 * unit}
                />
                <Text
                    text="YOU ARE HERE"
                    fontStyle="bold"
                    fontSize={Math.max(9, 4.6 * unit)}
                    letterSpacing={0.4 * unit}
                    padding={1.8 * unit}
                    fill="#ffffff"
                />
            </Label>
        </Group>
    );
}
