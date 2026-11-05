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

test('all 132 QR location/table routes use clear right-angle aisles and the correct doorway', () => {
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
                    `${context}: choose a configured entry`);
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

test('both posters choose the entry closest to the table along a clear indoor path', () => {
    const distance = points => points.slice(1).reduce((sum, point, index) => sum
        + Math.abs(point.x - points[index].x) + Math.abs(point.y - points[index].y), 0);
    for (const poster of [doors[5], doors[6]]) {
        const entriesUsed = new Set();
        for (const table of plan.tables) {
            const route = findTableRoute(plan, poster, table.number);
            entriesUsed.add(route[2].x);
            for (const number of [1, 2, 3, 4]) {
                const indoor = findTableRoute(plan, doors[number], table.number);
                assert.ok(distance(route.slice(2)) <= distance(indoor),
                    `${poster.name} to Table ${table.number}: entry closest to table takes priority over poster distance`);
            }
        }
        assert.deepEqual([...entriesUsed].sort((a, b) => a - b), [78, 148, 224, 302], 'all entries can be selected');
        assert.equal(findTableRoute(plan, poster, 1)[2].x, doors[4].x, 'left-side table uses Entry 4');
        assert.equal(findTableRoute(plan, poster, 7)[2].x, doors[1].x, 'right-side table uses Entry 1');
    }
});

test('both posters fall back to another entry if the closest is blocked', () => {
    for (const poster of [doors[5], doors[6]]) {
        for (const table of [1, 7]) {
            const blockedX = findTableRoute(plan, poster, table)[2].x;
            const blocked = structuredClone(plan);
            blocked.obstacles.push({ x: blockedX - 7, y: 212, width: 14, height: 8 });
            const route = findTableRoute(blocked, poster, table);
            assert.ok(route);
            assert.notEqual(route[2].x, blockedX, 'use an unblocked doorway');
        }
        const blocked = structuredClone(plan);
        blocked.obstacles.push({ x: 12, y: 205, width: 336, height: 2 });
        assert.equal(findTableRoute(blocked, poster, 1), null);
    }
});

test('the Right-side poster goes around the corner before crossing the wall at the chosen entry', () => {
    const roomRight = plan.ballroom.x + plan.ballroom.width;
    const roomBottom = plan.ballroom.y + plan.ballroom.height;
    for (const table of plan.tables) {
        const route = findTableRoute(plan, doors[6], table.number);
        assert.deepEqual(route.slice(0, 2), [
            { x: doors[6].x, y: doors[6].y },
            { x: doors[6].x, y: doors[1].y },
        ]);
        assert.ok(route[0].x > roomRight, 'first segment stays outside the east wall');
        assert.ok(route[1].y > roomBottom, 'horizontal segment stays south of the ballroom');
        assert.equal(route[3].x, route[2].x, 'cross the south wall at the chosen entry');
        assert.ok(route[3].y < roomBottom);
    }
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
