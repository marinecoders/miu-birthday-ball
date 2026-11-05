import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { findTableRoute, ROUTE_CLEARANCE } from '../src/lib/table-route.js';

const read = path => JSON.parse(readFileSync(new URL(path, import.meta.url), 'utf8'));
const plan = read('../src/lib/floor-plan.json');
const { doors } = read('../src/lib/doors.json');
const tablePadding = plan.tableRadius + ROUTE_CLEARANCE;

// Independent segment/rectangle intersection check, including touching edges.
function intersects(a, b, rect) {
    return Math.max(a.x, b.x) >= rect.x && Math.min(a.x, b.x) <= rect.x + rect.width
        && Math.max(a.y, b.y) >= rect.y && Math.min(a.y, b.y) <= rect.y + rect.height;
}

test('all 110 QR location/table routes use clear right-angle aisles and the correct doorway', () => {
    const obstacles = [
        ...plan.tables.map(t => ({ x: t.x - tablePadding, y: t.y - tablePadding,
            width: tablePadding * 2, height: tablePadding * 2 })),
        ...plan.obstacles.map(o => ({ x: o.x - ROUTE_CLEARANCE, y: o.y - ROUTE_CLEARANCE,
            width: o.width + ROUTE_CLEARANCE * 2, height: o.height + ROUTE_CLEARANCE * 2 })),
    ];
    for (const [entry, door] of Object.entries(doors)) {
        for (const table of plan.tables) {
            const context = `Entry ${entry} to Table ${table.number}`;
            const route = findTableRoute(plan, door, table.number);
            assert.ok(route?.length >= 2, context);
            assert.deepEqual(route[0], { x: door.x, y: door.y }, context);
            const indoorIndex = door.via ? 3 : 1;
            const approach = door.via ? route[2] : door;
            if (door.via) {
                assert.deepEqual(route[1], { x: door.x, y: 237 }, `${context}: use the open foyer lane`);
                assert.ok(door.via.some(entry => entry.x === approach.x && entry.y === approach.y),
                    `${context}: choose Entry 2 or 3`);
            }
            assert.equal(route[indoorIndex].x, approach.x, `${context}: pass vertically through this door`);
            assert.ok(route[indoorIndex].y <= 217, `${context}: first indoor turn inside the ballroom`);
            let length = 0;
            for (let i = 1; i < route.length; i++) {
                const a = route[i - 1], b = route[i];
                assert.ok((a.x === b.x) !== (a.y === b.y), `${context}: nonzero orthogonal segment`);
                if (i >= indoorIndex) {
                    assert.ok(b.x >= 15 && b.x <= 345 && b.y >= 21 && b.y <= 217, `${context}: stays in room`);
                }
                for (const obstacle of obstacles) {
                    assert.equal(intersects(a, b, obstacle), false, `${context}: clears every padded obstacle`);
                }
                if (i > 1) {
                    const previous = route[i - 2];
                    assert.ok((previous.x === a.x) !== (a.x === b.x), `${context}: only corners remain`);
                }
                length += Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
            }
            const end = route.at(-1);
            assert.equal(Math.hypot(end.x - table.x, end.y - table.y), tablePadding + 1,
                `${context}: stops beside the destination, not through it`);
            const direct = Math.abs(door.x - table.x) + Math.abs(door.y - table.y);
            assert.ok(length < direct + 120, `${context}: avoids excessive detours`);
            assert.ok(route.length <= (door.via ? 12 : 10), `${context}: few readable turns`);
        }
    }
});

test('the Main poster uses both central entries and falls back when one is blocked', () => {
    const entriesUsed = new Set();
    for (const table of plan.tables) {
        const route = findTableRoute(plan, doors[5], table.number);
        entriesUsed.add(route[2].x);
        const cost = points => points.slice(1).reduce((sum, point, index) => sum
            + Math.abs(point.x - points[index].x) + Math.abs(point.y - points[index].y), 0)
            + 6 * (points.length - 2);
        for (const entry of doors[5].via) {
            const candidate = [{ x: doors[5].x, y: doors[5].y }, { x: doors[5].x, y: entry.y },
                ...findTableRoute(plan, entry, table.number)];
            assert.ok(cost(route) <= cost(candidate), 'choose the shorter route including turns');
        }
    }
    assert.deepEqual([...entriesUsed].sort((a, b) => a - b), [148, 224]);
    for (const blockedX of [148, 224]) {
        const blocked = structuredClone(plan);
        blocked.obstacles.push({ x: blockedX - 7, y: 212, width: 14, height: 8 });
        const route = findTableRoute(blocked, doors[5], 1);
        assert.ok(route);
        assert.notEqual(route[2].x, blockedX, 'use the other doorway');
    }
    const blocked = structuredClone(plan);
    blocked.obstacles.push({ x: 12, y: 205, width: 336, height: 2 });
    assert.equal(findTableRoute(blocked, doors[5], 1), null);
});

test('invalid entries and tables have no route', () => {
    assert.equal(findTableRoute(plan, null, 1), null);
    assert.equal(findTableRoute(plan, doors[1], 23), null);
    assert.equal(findTableRoute(plan, doors[1], 34), null);
    assert.equal(findTableRoute(plan, doors[1], 'pow'), null);
    assert.equal(findTableRoute(plan, doors[1], ''), null);
    assert.equal(findTableRoute(plan, { x: 0, y: 237 }, 1), null);
    assert.equal(findTableRoute(plan, { x: 302, y: 100 }, 1), null);
});

test('blocked entrances and unreachable destinations fail without crossing obstacles', () => {
    const blockedEntry = structuredClone(plan);
    blockedEntry.obstacles.push({ x: 295, y: 212, width: 14, height: 8 });
    assert.equal(findTableRoute(blockedEntry, doors[1], 1), null);
    const blockedRoom = structuredClone(plan);
    blockedRoom.obstacles.push({ x: 12, y: 205, width: 336, height: 2 });
    assert.equal(findTableRoute(blockedRoom, doors[1], 1), null);
});

test('changing entry or table recomputes the route', () => {
    const first = findTableRoute(plan, doors[1], 1);
    assert.notDeepEqual(first, findTableRoute(plan, doors[4], 1));
    assert.notDeepEqual(first, findTableRoute(plan, doors[1], 22));
    assert.deepEqual(first, findTableRoute(plan, doors[1], '1'), 'stable across repeated renders');
});
