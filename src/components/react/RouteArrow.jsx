import React, { useEffect, useMemo, useRef } from "react";
import Konva from "konva";
import { Arrow, Group, Line, Shape } from "react-konva";

const PULSE_LENGTH = 36; // Floor-plan units, independent of screen size.
const SPEED = 52; // Floor-plan units per second, including around corners.

export default function RouteArrow({ route }) {
    const pulse = useRef(null);
    const head = useRef(0);
    const { points, segments, length } = useMemo(() => {
        let distance = 0;
        const segments = route.slice(1).map((end, index) => {
            const start = route[index];
            const length = Math.hypot(end.x - start.x, end.y - start.y);
            const segment = { start, end, length, offset: distance };
            distance += length;
            return segment;
        });
        return { points: route.flatMap(point => [point.x, point.y]), segments, length: distance };
    }, [route]);

    useEffect(() => {
        const node = pulse.current;
        const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
        head.current = 0;
        const animation = new Konva.Animation(frame => {
            // Let the tail clear the destination before starting the next pulse.
            head.current = (frame.time * SPEED / 1000) % (length + PULSE_LENGTH + 16);
        }, node.getLayer());
        const updateMotion = () => {
            animation.stop();
            node.visible(!motion.matches);
            if (!motion.matches) animation.start();
            node.getLayer()?.batchDraw();
        };
        updateMotion();
        motion.addEventListener("change", updateMotion);
        return () => {
            animation.stop();
            motion.removeEventListener("change", updateMotion);
        };
    }, [length, route]);

    function drawPulse(context) {
        const tail = head.current - PULSE_LENGTH;
        context.save();
        context.setAttr("lineWidth", 1.9);
        context.setAttr("lineCap", "butt");
        for (const segment of segments) {
            const from = Math.max(segment.offset, tail);
            const to = Math.min(segment.offset + segment.length, head.current);
            if (from >= to || !segment.length) continue;
            const dx = (segment.end.x - segment.start.x) / segment.length;
            const dy = (segment.end.y - segment.start.y) / segment.length;
            const at = distance => ({
                x: segment.start.x + dx * (distance - segment.offset),
                y: segment.start.y + dy * (distance - segment.offset),
            });
            // Each segment uses the same distance-based gradient. Brightness
            // stays continuous through a turn, without cutting across its corner.
            const gradientStart = at(tail), gradientEnd = at(head.current);
            const gradient = context.createLinearGradient(gradientStart.x, gradientStart.y, gradientEnd.x, gradientEnd.y);
            gradient.addColorStop(0, "rgba(56, 189, 248, 0)");
            gradient.addColorStop(0.5, "rgba(56, 189, 248, 0.65)");
            gradient.addColorStop(0.82, "#a5f3fc");
            gradient.addColorStop(1, "#ffffff");
            const start = at(from), end = at(to);
            context.setAttr("strokeStyle", gradient);
            context.beginPath();
            context.moveTo(start.x, start.y);
            context.lineTo(end.x, end.y);
            context.stroke();
        }
        context.restore();
    }

    return <Group id="table-route" listening={false}>
        <Line points={points} stroke="#ffffff" strokeWidth={3.4}
            lineJoin="miter" lineCap="round" />
        <Arrow points={points} stroke="#2563eb" fill="#2563eb" strokeWidth={1.9}
            pointerLength={3.6} pointerWidth={3.6} lineJoin="miter" lineCap="round" />
        <Shape ref={pulse} visible={false} sceneFunc={drawPulse} perfectDrawEnabled={false} />
    </Group>;
}
