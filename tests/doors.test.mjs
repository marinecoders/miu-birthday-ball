import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8');
const plan = JSON.parse(read('../src/lib/floor-plan.json'));
const { doors } = JSON.parse(read('../src/lib/doors.json'));
const mapCode = read('../src/components/react/SeatingMap.jsx');

test('there are four doors, numbered 1-4, each with a name for its QR sign', () => {
    assert.deepEqual(Object.keys(doors), ['1', '2', '3', '4']);
    for (const door of Object.values(doors)) assert.ok(door.name.trim(), 'door has a name');
});

test('each door pin sits on the map, just outside the ballroom south wall', () => {
    for (const [number, door] of Object.entries(doors)) {
        assert.ok(door.x > 0 && door.x < plan.width, `Door ${number} is across the map`);
        assert.ok(door.y > 220 && door.y < plan.height, `Door ${number} is in the foyer, below the south wall`);
        assert.ok(['above', 'below', 'left', 'right'].includes(door.label), `Door ${number} label side`);
    }
});

test('door pins line up with the doors drawn on the map, west to east', () => {
    const drawn = mapCode.match(/\[([\d,\s]+)\]\.map\(x => <Doors /);
    assert.ok(drawn, 'SeatingMap.jsx draws its doors from a list of x positions');
    const drawnX = drawn[1].split(',').map(Number);
    assert.deepEqual(Object.values(doors).map(d => d.x), drawnX);
});
