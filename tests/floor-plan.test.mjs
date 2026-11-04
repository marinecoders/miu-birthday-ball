import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const plan = JSON.parse(readFileSync(new URL('../src/lib/floor-plan.json', import.meta.url), 'utf8'));
const { doors } = JSON.parse(readFileSync(new URL('../src/lib/doors.json', import.meta.url), 'utf8'));

test('the floor plan contains exactly tables 1–21, numbered front to back and left to right', () => {
    assert.deepEqual(plan.tables.map(t => t.number), Array.from({ length: 21 }, (_, i) => i + 1));
    const ordered = [...plan.tables].sort((a, b) => a.y - b.y || a.x - b.x);
    assert.deepEqual(plan.tables, ordered);
});

test('three rows of seven align in two seating blocks without VIP designations', () => {
    const rows = [1, 2, 3].map(row => plan.tables.filter(t => t.row === row));
    assert.deepEqual(rows.map(row => row.length), [7, 7, 7]);
    assert.ok(plan.tables.every(t => !Object.hasOwn(t, 'vip')));
    const columns = rows[0].map(t => t.x);
    for (const tables of rows) {
        assert.deepEqual(tables.map(t => t.x), columns, 'columns line up across rows');
        assert.equal(new Set(tables.map(t => t.y)).size, 1, 'each row is level');
        const left = tables.filter(t => t.x < plan.ceremonyAisle.x);
        const right = tables.filter(t => t.x > plan.ceremonyAisle.x + plan.ceremonyAisle.width);
        assert.deepEqual([left.length, right.length], [3, 4], 'seating flanks the ceremony aisle');
        for (const block of [left, right]) {
            const pitch = block[1].x - block[0].x;
            assert.ok(block.every((t, i) => i === 0 || t.x - block[i - 1].x === pitch), 'each block has equal column spacing');
            assert.ok(pitch - plan.tableRadius * 2 >= 18, 'clear gaps between columns');
        }
    }
    const rowPitch = rows[1][0].y - rows[0][0].y;
    assert.equal(rows[2][0].y - rows[1][0].y, rowPitch, 'row spacing is uniform');
    assert.ok(rowPitch - plan.tableRadius * 2 >= 20, 'wide gaps between rows');
});

test('the first row gently wraps the ceremony area without advancing beyond the original front row', () => {
    const frontRow = plan.tables.filter(t => t.row === 1);
    // The previous first row ranged from y86 to y95. Stay behind its rear edge.
    assert.ok(frontRow.every(t => t.y >= 95));
    const ceremony = plan.obstacles.find(o => o.id === 'ceremony');
    assert.ok(frontRow.every(t => t.y - plan.tableRadius < ceremony.y + ceremony.height), 'first row wraps its lower corners');
    assert.ok(frontRow.every(t => t.x + plan.tableRadius + 3 < ceremony.x
        || t.x - plan.tableRadius - 3 > ceremony.x + ceremony.width), 'tables stay beside the ceremony area');
});

test('the entire ceremony aisle remains free of furniture down to the back wall', () => {
    const aisle = plan.ceremonyAisle;
    const ceremony = plan.obstacles.find(o => o.id === 'ceremony');
    assert.equal(aisle.x, ceremony.x);
    assert.equal(aisle.width, ceremony.width);
    assert.equal(aisle.y, ceremony.y + ceremony.height);
    assert.equal(aisle.y + aisle.height, plan.ballroom.y + plan.ballroom.height);
    const furniture = [
        ...plan.tables.map(t => ({ x: t.x - plan.tableRadius - 3, y: t.y - plan.tableRadius - 3,
            width: (plan.tableRadius + 3) * 2, height: (plan.tableRadius + 3) * 2 })),
        ...plan.obstacles.filter(o => o.id !== 'ceremony'),
    ];
    for (const item of furniture) {
        const overlaps = item.x < aisle.x + aisle.width && item.x + item.width > aisle.x
            && item.y < aisle.y + aisle.height && item.y + item.height > aisle.y;
        assert.equal(overlaps, false, 'the reserved ceremony strip has no furniture');
    }
});

test('the separate circular POW/MIA table sits right of Entry 2 with extra space behind the guest tables', () => {
    const pow = plan.obstacles.find(o => o.id === 'pow');
    assert.ok(pow, 'POW table is an obstacle, not a numbered guest table');
    assert.equal(pow.width, pow.height, 'routing envelope fits the circular table');
    assert.ok(pow.x > doors[2].x + 9 + 5, 'clear of Entry 2 doorway');
    assert.ok(pow.x + pow.width < doors[1].x - 9 - 5, 'before Entry 1 doorway');
    assert.ok(pow.y + pow.height <= plan.ballroom.y + plan.ballroom.height - 5, 'inside the ballroom');
    const backRow = plan.tables.filter(t => t.row === 3);
    const guestRearEdge = Math.max(...backRow.map(t => t.y + plan.tableRadius));
    assert.ok(pow.y - guestRearEdge >= 16, 'extra room between guest tables and POW table');
    assert.ok(plan.ballroom.y + plan.ballroom.height - guestRearEdge >= 30, 'rear row pulled away from back wall');
    for (const table of backRow) {
        assert.ok(table.x - plan.tableRadius - plan.ballroom.x >= 20, 'rear row inset from left wall');
        assert.ok(plan.ballroom.x + plan.ballroom.width - table.x - plan.tableRadius >= 20, 'rear row inset from right wall');
    }
});

test('tables fit inside the ballroom without overlapping each other or the ceremony area', () => {
    for (const table of plan.tables) {
        const r = plan.tableRadius;
        assert.ok(table.x - r > 12 && table.x + r < 348);
        assert.ok(table.y - r > 18 && table.y + r < 220);
        for (const obstacle of plan.obstacles) {
            const nearestX = Math.max(obstacle.x, Math.min(table.x, obstacle.x + obstacle.width));
            const nearestY = Math.max(obstacle.y, Math.min(table.y, obstacle.y + obstacle.height));
            assert.ok(Math.hypot(table.x - nearestX, table.y - nearestY) > r + 3,
                `Table ${table.number} clears ${obstacle.id}`);
        }
        for (const other of plan.tables.filter(t => t.number > table.number)) {
            assert.ok(Math.hypot(table.x - other.x, table.y - other.y) > 2 * r,
                `Tables ${table.number} and ${other.number} do not overlap`);
        }
    }
    assert.ok(plan.entrance.y > 220 && plan.entrance.y < plan.height);
});
