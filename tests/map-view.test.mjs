import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { getMapView } from '../src/lib/map-view.js';
import { findTableRoute } from '../src/lib/table-route.js';

const read = path => JSON.parse(readFileSync(new URL(path, import.meta.url), 'utf8'));
const plan = read('../src/lib/floor-plan.json');
const { doors } = read('../src/lib/doors.json');

function within(view, point, width, height, context) {
    const x = point.x * view.scale + view.x, y = point.y * view.scale + view.y;
    assert.ok(x >= 15.9 && x <= width - 15.9 && y >= 15.9 && y <= height - 15.9,
        `${context}: (${x}, ${y}) fits within ${width}×${height}`);
}

test('every mobile route fits its entire path, table highlight, and entry label without scrolling', () => {
    for (const [entry, origin] of Object.entries(doors)) {
        for (const table of plan.tables) {
            const route = findTableRoute(plan, origin, table.number);
            assert.ok(route);
            for (const width of [280, 320, 375, 430, 768]) {
                for (const height of [260, 400, 560]) {
                    const context = `Entry ${entry} to Table ${table.number}`;
                    const view = getMapView(plan, { mode: 'route', route, table, origin, width, height });
                    assert.ok(view.scale > 0 && view.scale <= 3);
                    for (const point of [...route,
                        { x: table.x - 18, y: table.y - 18 },
                        { x: table.x + 18, y: table.y + 18 },
                        { x: origin.x - Math.max(28, 36 / view.scale), y: origin.y - 9 },
                        { x: origin.x + Math.max(28, 36 / view.scale), y: origin.y + Math.max(18, 30 / view.scale) },
                    ]) within(view, point, width, height, context);
                }
            }
        }
    }
});

test('whole-room view fits the complete floor plan on portrait and landscape screens', () => {
    for (const [width, height] of [[320, 280], [375, 400], [844, 280], [960, 811]]) {
        const view = getMapView(plan, { mode: 'room', width, height });
        within(view, { x: 0, y: 0 }, width, height, 'top left');
        within(view, { x: plan.width, y: plan.height }, width, height, 'bottom right');
    }
});

test('my-table view centers and enlarges the selected table; missing context falls back to whole room', () => {
    const width = 375, height = 400, table = plan.tables.at(-1);
    const overview = getMapView(plan, { mode: 'room', width, height });
    const detail = getMapView(plan, { mode: 'table', table, width, height });
    assert.ok(detail.scale > overview.scale);
    assert.equal(table.x * detail.scale + detail.x, width / 2);
    assert.equal(table.y * detail.scale + detail.y, height / 2);
    within(detail, { x: table.x - 18, y: table.y - 18 }, width, height, 'table highlight');
    assert.deepEqual(getMapView(plan, { mode: 'route', width, height }), overview);
    assert.deepEqual(getMapView(plan, { mode: 'table', width, height }), overview);
});
