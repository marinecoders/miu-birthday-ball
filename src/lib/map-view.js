const PADDING = 16;

function boundsOf(points) {
    const xs = points.map(p => p.x), ys = points.map(p => p.y);
    const x = Math.min(...xs), y = Math.min(...ys);
    return { x, y, width: Math.max(...xs) - x, height: Math.max(...ys) - y };
}

function fit(bounds, width, height, maxScale) {
    const scale = Math.min(maxScale,
        Math.max(1, width - PADDING * 2) / Math.max(1, bounds.width),
        Math.max(1, height - PADDING * 2) / Math.max(1, bounds.height));
    return {
        scale,
        x: (width - bounds.width * scale) / 2 - bounds.x * scale,
        y: (height - bounds.height * scale) / 2 - bounds.y * scale,
    };
}

// Fit the route, the complete destination highlight, and the entry pin's label.
// The pin has a minimum screen font size, so its bounds also depend on zoom.
export function getMapView(plan, { width, height, mode = 'room', route, table, origin }) {
    const room = { x: 0, y: 0, width: plan.width, height: plan.height };
    if (mode === 'table' && table) {
        return fit({ x: table.x - 36, y: table.y - 36, width: 72, height: 72 }, width, height, 4);
    }
    if (mode !== 'route' || !route?.length || !table || !origin) {
        return fit(room, width, height, Infinity);
    }
    const points = [...route,
        { x: table.x - 18, y: table.y - 18 },
        { x: table.x + 18, y: table.y + 18 },
    ];
    let view = fit(boundsOf(points), width, height, 3);
    // Converge on the label's screen-space minimum without guessing a phone width.
    for (let i = 0; i < 12; i++) {
        const halfLabel = Math.max(28, 36 / view.scale);
        const belowLabel = Math.max(18, 30 / view.scale);
        const bounds = boundsOf([...points,
            { x: origin.x - halfLabel, y: origin.y - 9 },
            { x: origin.x + halfLabel, y: origin.y + belowLabel },
        ]);
        view = fit(bounds, width, height, 3);
    }
    return view;
}
