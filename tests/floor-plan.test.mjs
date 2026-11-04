import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const plan = JSON.parse(readFileSync(new URL('../src/lib/floor-plan.json', import.meta.url), 'utf8'));

test('reference tables 8–41 become a complete, unique set of tables 1–34', () => {
    assert.deepEqual(plan.tables.map(t => t.number), Array.from({ length: 34 }, (_, i) => i + 1));
    assert.deepEqual(plan.tables.map(t => t.sourceTable), Array.from({ length: 34 }, (_, i) => i + 8));
});

test('the four reference rows and highlighted VIP positions are preserved', () => {
    assert.deepEqual([1, 2, 3, 4].map(row => plan.tables.filter(t => t.row === row).length), [7, 9, 9, 9]);
    assert.deepEqual(plan.tables.filter(t => t.vip).map(t => t.sourceTable), [10, 11, 18, 19]);
    for (const row of [1, 2, 3, 4]) {
        const tables = plan.tables.filter(t => t.row === row);
        assert.ok(tables.every((t, i) => i === 0 || t.x > tables[i - 1].x), `Row ${row} runs left to right`);
    }
    assert.ok(plan.tables[0].x < plan.width / 2, 'Table 1 starts on the left, at pictured table 8');
});

test('tables fit inside the ballroom without overlapping each other or the ceremony area', () => {
    for (const table of plan.tables) {
        const r = plan.tableRadius;
        assert.ok(table.x - r > 12 && table.x + r < 348);
        assert.ok(table.y - r > 18 && table.y + r < 220);
        const nearestX = Math.max(136, Math.min(table.x, 196));
        const nearestY = Math.max(42, Math.min(table.y, 99));
        assert.ok(Math.hypot(table.x - nearestX, table.y - nearestY) > r, `Table ${table.number} clears the ceremony area`);
        for (const other of plan.tables.filter(t => t.number > table.number)) {
            assert.ok(Math.hypot(table.x - other.x, table.y - other.y) > 2 * r,
                `Tables ${table.number} and ${other.number} do not overlap`);
        }
    }
    assert.ok(plan.entrance.y > 220 && plan.entrance.y < plan.height);
});
