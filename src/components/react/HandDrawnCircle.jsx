import React, { useEffect, useMemo, useRef, useState } from "react";
import Konva from "konva";
import { Shape } from "react-konva";

// A red crayon loop drawn around the guest's table.
//
// - Slightly different every page load: the start point, how far it
//   overshoots, the tilt, and the wobble come from a new random seed.
// - Crayon texture: three overlapping passes, each jittered a little,
//   stroked with a grainy pattern so specks of "paper" show through.
// - It draws itself in like a quick crayon stroke.

// Small seeded random generator (so one page view stays stable on resize).
function seeded(seed) {
    let s = seed % 2147483647 || 1;
    return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

// Points for a loose, hand-drawn loop around (x, y): slightly oval, a little
// wobbly, overshooting its start, and ending a bit outside where it began.
function sketchPoints(x, y, radius, rand) {
    const start = -Math.PI / 2 - 1.2 + rand() * 2.4; // begins anywhere across the top
    const turn = Math.PI * 2 * (1.06 + rand() * 0.16); // overshoots 6-22%
    const tilt = (rand() - 0.5) * 0.7;
    const squash = 0.9 + rand() * 0.16;
    const wobbleA = rand() * 6.28, wobbleB = rand() * 6.28;
    const spiral = 0.08 + rand() * 0.12;
    const steps = 72;
    const points = [];
    for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const angle = start + turn * t;
        const wobble = 1 + Math.sin(angle * 2 + wobbleA) * 0.035 + Math.sin(angle * 5 + wobbleB) * 0.02;
        const r = radius * wobble * (1 + t * spiral);
        const px = Math.cos(angle) * r * 1.12;
        const py = Math.sin(angle) * r * squash;
        points.push([
            x + px * Math.cos(tilt) - py * Math.sin(tilt),
            y + px * Math.sin(tilt) + py * Math.cos(tilt),
        ]);
    }
    return points;
}

// Each pass follows the loop with its own small sideways drift.
function makePasses(points, strokeWidth, rand) {
    const specs = [
        { width: 1.0, alpha: 0.85, drift: 0.0 },
        { width: 0.75, alpha: 0.6, drift: 0.35 },
        { width: 0.55, alpha: 0.5, drift: 0.45 },
    ];
    return specs.map((spec) => {
        const phase = rand() * 6.28;
        const amp = spec.drift * strokeWidth;
        return {
            ...spec,
            points: points.map(([px, py], i) => [
                px + Math.sin(i * 0.31 + phase) * amp,
                py + Math.cos(i * 0.27 + phase) * amp,
            ]),
        };
    });
}

function pathLength(points) {
    let length = 0;
    for (let i = 1; i < points.length; i++) {
        length += Math.hypot(points[i][0] - points[i - 1][0], points[i][1] - points[i - 1][1]);
    }
    return length;
}

// A small tile of crayon grain: the color at uneven strength, with gaps.
const grainCache = new Map();
function crayonGrain(color) {
    if (grainCache.has(color)) return grainCache.get(color);
    const size = 48;
    const tile = document.createElement("canvas");
    tile.width = tile.height = size;
    const ctx = tile.getContext("2d");
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 1, 1);
    const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
    const image = ctx.createImageData(size, size);
    for (let i = 0; i < size * size; i++) {
        const n = Math.random();
        // ~14% bare paper, the rest waxy color of varying density.
        const alpha = n < 0.14 ? 0 : 150 + Math.random() * 105;
        image.data.set([r, g, b, alpha], i * 4);
    }
    ctx.putImageData(image, 0, 0);
    grainCache.set(color, tile);
    return tile;
}

export default function HandDrawnCircle({ x, y, radius, color = "#BA0C2F", strokeWidth = 3 }) {
    const shape = useRef(null);
    // A new seed each page load, so the loop varies from visit to visit.
    const [seed] = useState(() => Math.floor(Math.random() * 2147483646) + 1);

    const passes = useMemo(() => {
        const rand = seeded(seed);
        return makePasses(sketchPoints(x, y, radius, rand), strokeWidth, rand);
    }, [x, y, radius, strokeWidth, seed]);
    const length = useMemo(() => pathLength(passes[0].points), [passes]);

    useEffect(() => {
        const node = shape.current;
        if (!node) return;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            node.setAttr("progress", 1);
            node.getLayer()?.batchDraw();
            return;
        }
        node.setAttr("progress", 0);
        let anim;
        const timer = setTimeout(() => {
            const begin = performance.now();
            anim = new Konva.Animation(() => {
                const t = Math.min(1, (performance.now() - begin) / 850);
                // Quick in the middle, easing at both ends, like a hand stroke.
                node.setAttr("progress", t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
                if (t >= 1) anim.stop();
            }, node.getLayer());
            anim.start();
        }, 450);
        return () => {
            clearTimeout(timer);
            anim?.stop();
        };
    }, [passes]);

    return (
        <Shape
            ref={shape}
            listening={false}
            progress={0}
            sceneFunc={(konvaContext, node) => {
                const progress = node.getAttr("progress") ?? 1;
                if (progress <= 0) return;
                const ctx = konvaContext._context; // the plain 2D canvas context
                const grain = ctx.createPattern(crayonGrain(color), "repeat");
                // Keep grain specks about 1.3 screen pixels, whatever the map's zoom.
                const zoom = ctx.getTransform().a || 1;
                grain.setTransform?.(new DOMMatrix().scale(1.3 / zoom));
                ctx.save();
                ctx.lineCap = "round";
                ctx.lineJoin = "round";
                ctx.strokeStyle = grain;
                for (const pass of passes) {
                    ctx.globalAlpha = pass.alpha;
                    ctx.lineWidth = strokeWidth * pass.width;
                    ctx.setLineDash([length * progress, length * 2]);
                    ctx.beginPath();
                    pass.points.forEach(([px, py], i) => (i ? ctx.lineTo(px, py) : ctx.moveTo(px, py)));
                    ctx.stroke();
                }
                ctx.restore();
            }}
        />
    );
}
