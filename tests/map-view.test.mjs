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
                    const overview = getMapView(plan, { mode: 'room', width, height });
                    assert.ok(view.scale > 0 && view.scale <= Math.min(3, overview.scale * 1.6) + 1e-9);
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

test('close-ups respect relative zoom caps while long routes can zoom farther out', () => {
    const table = plan.tables.find(t => t.number === 22);
    const origin = doors[4];
    const route = findTableRoute(plan, origin, table.number);
    const distantTable = plan.tables.find(t => t.number === 1);
    const longRoute = findTableRoute(plan, doors[1], distantTable.number);
    let zoomedOutForLongRoute = false;
    for (const [width, height] of [[320, 320], [375, 400], [430, 560], [844, 260], [960, 811]]) {
        const overview = getMapView(plan, { mode: 'room', width, height });
        const detail = getMapView(plan, { mode: 'table', table, width, height });
        const short = getMapView(plan, { mode: 'route', route, table, origin, width, height });
        assert.ok(Math.abs(detail.scale - Math.min(4, overview.scale * 2)) < 1e-9,
            `${width}×${height}: table zoom stops at 2× overview or the existing desktop limit`);
        assert.ok(Math.abs(short.scale - Math.min(3, overview.scale * 1.6)) < 1e-9,
            `${width}×${height}: a short route stops at 1.6× overview or the existing desktop limit`);
        const long = getMapView(plan, { mode: 'route', route: longRoute, table: distantTable,
            origin: doors[1], width, height });
        assert.ok(long.scale <= short.scale, 'long routes respect the same maximum zoom');
        if (long.scale < short.scale - 1e-9) zoomedOutForLongRoute = true;
    }
    assert.ok(zoomedOutForLongRoute, 'a long route can zoom below the cap when space requires it');
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
    assert.ok(Math.abs(table.x * detail.scale + detail.x - width / 2) < 1e-9);
    assert.ok(Math.abs(table.y * detail.scale + detail.y - height / 2) < 1e-9);
    within(detail, { x: table.x - 18, y: table.y - 18 }, width, height, 'table highlight');
    assert.deepEqual(getMapView(plan, { mode: 'route', width, height }), overview);
    assert.deepEqual(getMapView(plan, { mode: 'table', width, height }), overview);
});
