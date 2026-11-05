import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8');
const plan = JSON.parse(read('../src/lib/floor-plan.json'));
const { doors } = JSON.parse(read('../src/lib/doors.json'));
const mapCode = read('../src/components/react/SeatingMap.jsx');

test('there are five QR locations, each with a name for its QR sign', () => {
    assert.deepEqual(Object.keys(doors), ['1', '2', '3', '4', '5']);
    for (const door of Object.values(doors)) assert.ok(door.name.trim(), 'door has a name');
});

test('each door pin sits on the map, just outside the ballroom south wall', () => {
    for (const [number, door] of Object.entries(doors)) {
        assert.ok(door.x > 0 && door.x < plan.width, `Door ${number} is across the map`);
        assert.ok(door.y > 220 && door.y < plan.height, `Door ${number} is in the foyer, below the south wall`);
        assert.ok(['above', 'below', 'left', 'right'].includes(door.label), `Door ${number} label side`);
    }
});

test('door pins line up with the doors drawn on the map, Door 1 on the far right', () => {
    // Matches both `[...].map(x => <Doors` and `[...].map((x, index) => <Doors`
    // (with or without a line break before <Doors).
    const drawn = mapCode.match(/\[([\d,\s]+)\]\.map\(\(?x(?:,\s*\w+)?\)?\s*=>\s*<Doors /);
    assert.ok(drawn, 'SeatingMap.jsx draws its doors from a list of x positions');
    const eastToWest = drawn[1].split(',').map(Number).sort((a, b) => b - a);
    assert.deepEqual(['1', '2', '3', '4'].map(number => doors[number].x), eastToWest, 'Doors 1-4 run right to left');
});

test('the Main poster sits in the middle of the foyer between Entries 2 and 3', () => {
    assert.equal(doors[5].x, (doors[2].x + doors[3].x) / 2);
    assert.ok(doors[5].y > doors[2].y && doors[5].y < 276, 'in the open foyer ahead of the bars');
    assert.deepEqual(doors[5].via, ['3', '2'].map(number => ({ x: doors[number].x, y: doors[number].y })));
});
