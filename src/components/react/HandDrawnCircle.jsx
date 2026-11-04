import React, { useEffect, useMemo, useRef } from "react";
import Konva from "konva";
import { Line } from "react-konva";

// Small seeded random generator, so a table's circle looks the same every visit.
function seeded(seed) {
    let s = (Number(seed) || 1) * 9301 + 49297;
    return () => {
        s = (s * 9301 + 49297) % 233280;
        return s / 233280;
    };
}

// Points for a loose, pen-drawn loop around (x, y): slightly oval, a little
// wobbly, and overshooting its start the way a quick marker circle does.
function sketchPoints(x, y, radius, seed) {
    const rand = seeded(seed);
    const start = -Math.PI / 2 - 0.6 + rand() * 0.4;
    const turn = Math.PI * 2 * (1.12 + rand() * 0.08);
    const tilt = (rand() - 0.5) * 0.5;
    const steps = 30;
    const points = [];
    for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const angle = start + turn * t;
        const wobble = 1 + Math.sin(angle * 3 + rand() * 0.6) * 0.04 + (rand() - 0.5) * 0.05;
        const spiral = 1 + t * 0.14; // ends a little outside where it began
        const rx = radius * 1.18 * wobble * spiral;
        const ry = radius * 0.98 * wobble * spiral;
        const px = Math.cos(angle) * rx;
        const py = Math.sin(angle) * ry;
        points.push(
            x + px * Math.cos(tilt) - py * Math.sin(tilt),
            y + px * Math.sin(tilt) + py * Math.cos(tilt)
        );
    }
    return points;
}

function pathLength(points) {
    let length = 0;
    for (let i = 2; i < points.length; i += 2) {
        length += Math.hypot(points[i] - points[i - 2], points[i + 1] - points[i - 1]);
    }
    return length * 1.1; // the smoothed curve is a bit longer than its corners
}

export default function HandDrawnCircle({ x, y, radius, seed, color = "#BA0C2F", strokeWidth = 3 }) {
    const line = useRef(null);
    const points = useMemo(() => sketchPoints(x, y, radius, seed), [x, y, radius, seed]);
    const length = useMemo(() => pathLength(points), [points]);

    useEffect(() => {
        const node = line.current;
        if (!node) return;
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (reduceMotion) {
            node.dashOffset(0);
            return;
        }
        // "Draw" the stroke by sliding a dash the length of the path into view.
        node.dashOffset(length);
        const tween = new Konva.Tween({
            node,
            dashOffset: 0,
            duration: 0.9,
            easing: Konva.Easings.EaseInOut,
        });
        const timer = setTimeout(() => tween.play(), 500);
        return () => {
            clearTimeout(timer);
            tween.destroy();
        };
    }, [length]);

    return (
        <Line
            ref={line}
            points={points}
            tension={0.5}
            stroke={color}
            strokeWidth={strokeWidth}
            lineCap="round"
            lineJoin="round"
            dash={[length, length]}
            shadowColor={color}
            shadowBlur={strokeWidth}
            shadowOpacity={0.35}
            listening={false}
        />
    );
}
