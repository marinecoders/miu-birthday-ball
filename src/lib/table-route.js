// Routes use integer floor-plan units. Inflated table boxes leave room around
// every table (including the destination) and keep the entire stroke clear.
export const ROUTE_CLEARANCE = 3;
const grids = new WeakMap();
const TURN_COST = 6;

class MinHeap {
    items = [];
    push(item) {
        const items = this.items;
        let i = items.length;
        items.push(item);
        while (i > 0) {
            const parent = (i - 1) >> 1;
            if (items[parent].priority <= item.priority) break;
            items[i] = items[parent];
            i = parent;
        }
        items[i] = item;
    }
    pop() {
        const items = this.items;
        const first = items[0], last = items.pop();
        if (items.length) {
            let i = 0;
            while (i * 2 + 1 < items.length) {
                let child = i * 2 + 1;
                if (child + 1 < items.length && items[child + 1].priority < items[child].priority) child++;
                if (items[child].priority >= last.priority) break;
                items[i] = items[child];
                i = child;
            }
            items[i] = last;
        }
        return first;
    }
}

function getGrid(plan) {
    if (grids.has(plan)) return grids.get(plan);
    const { ballroom: room, width, height } = plan;
    const blocked = new Uint8Array(width * height).fill(1);
    const left = room.x + ROUTE_CLEARANCE, right = room.x + room.width - ROUTE_CLEARANCE;
    const top = room.y + ROUTE_CLEARANCE, bottom = room.y + room.height - ROUTE_CLEARANCE;
    for (let y = top; y <= bottom; y++) {
        blocked.fill(0, y * width + left, y * width + right + 1);
    }
    const r = plan.tableRadius;
    const obstacles = [
        ...plan.obstacles,
        ...plan.tables.map(t => ({ x: t.x - r, y: t.y - r, width: r * 2, height: r * 2 })),
    ];
    for (const obstacle of obstacles) {
        const x1 = Math.max(left, Math.ceil(obstacle.x - ROUTE_CLEARANCE));
        const x2 = Math.min(right, Math.floor(obstacle.x + obstacle.width + ROUTE_CLEARANCE));
        const y1 = Math.max(top, Math.ceil(obstacle.y - ROUTE_CLEARANCE));
        const y2 = Math.min(bottom, Math.floor(obstacle.y + obstacle.height + ROUTE_CLEARANCE));
        if (x1 > x2) continue;
        for (let y = y1; y <= y2; y++) blocked.fill(1, y * width + x1, y * width + x2 + 1);
    }
    const grid = { blocked, left, right, top, bottom };
    grids.set(plan, grid);
    return grid;
}

function simplify(points) {
    const result = [];
    for (const point of points) {
        const a = result.at(-2), b = result.at(-1);
        if (b && b.x === point.x && b.y === point.y) continue;
        if (a && ((a.x === b.x && b.x === point.x) || (a.y === b.y && b.y === point.y))) result.pop();
        result.push(point);
    }
    return result;
}

// Foyer locations can supply doorway approaches; ordinary entry pins sit
// directly south of their doorway. Search inside the ballroom only, so the
// indoor route cannot leave through a different door or cross a side wall.
// A* tracks arrival direction and charges for turns to favor simple aisle paths.
export function findTableRoute(plan, door, tableNumber) {
    const table = plan.tables.find(t => String(t.number) === String(tableNumber));
    if (!table || !door || !Number.isInteger(door.x) || !Number.isInteger(door.y)) return null;
    const { blocked, left, right, top, bottom } = getGrid(plan);
    const { width, height } = plan;
    if (door.x < left || door.x > right || door.y < plan.ballroom.y + plan.ballroom.height || door.y >= height) return null;
    if (door.via) {
        let best = null, bestCost = Infinity;
        for (const entry of door.via) {
            const indoor = findTableRoute(plan, entry, tableNumber);
            if (!indoor) continue;
            const route = simplify([{ x: door.x, y: door.y }, { x: door.x, y: entry.y }, ...indoor]);
            const cost = route.slice(1).reduce((sum, point, index) => sum
                + Math.abs(point.x - route[index].x) + Math.abs(point.y - route[index].y), 0)
                + TURN_COST * (route.length - 2);
            if (cost < bestCost) { best = route; bestCost = cost; }
        }
        return best;
    }
    const start = bottom * width + door.x;
    if (blocked[start]) return null;
    const distance = plan.tableRadius + ROUTE_CLEARANCE + 1;
    const goals = [[table.x - distance, table.y], [table.x + distance, table.y],
        [table.x, table.y - distance], [table.x, table.y + distance]]
        .filter(([x, y]) => x >= left && x <= right && y >= top && y <= bottom && !blocked[y * width + x]);
    if (!goals.length) return null;
    const targets = new Set(goals.map(([x, y]) => y * width + x));
    const heuristic = (cell) => {
        const x = cell % width, y = Math.floor(cell / width);
        return Math.min(...goals.map(([gx, gy]) => Math.abs(x - gx) + Math.abs(y - gy)));
    };
    // Each cell has horizontal (0) and vertical (1) arrival states.
    const costs = new Float64Array(width * height * 2).fill(Infinity);
    const previous = new Int32Array(costs.length).fill(-1);
    const initial = start * 2 + 1;
    const queue = new MinHeap();
    costs[initial] = 0;
    queue.push({ state: initial, cost: 0, priority: heuristic(start) });
    while (queue.items.length) {
        const { state, cost } = queue.pop();
        if (cost !== costs[state]) continue;
        const cell = state >> 1;
        if (targets.has(cell)) {
            const points = [];
            for (let cursor = state; cursor !== -1; cursor = previous[cursor]) {
                const position = cursor >> 1;
                points.push({ x: position % width, y: Math.floor(position / width) });
            }
            return simplify([{ x: door.x, y: door.y }, ...points.reverse()]);
        }
        for (const [offset, axis] of [[-width, 1], [-1, 0], [1, 0], [width, 1]]) {
            const next = cell + offset;
            if (next < 0 || next >= blocked.length || blocked[next]) continue;
            const nextState = next * 2 + axis;
            const nextCost = cost + 1 + (axis === (state & 1) ? 0 : TURN_COST);
            if (nextCost >= costs[nextState]) continue;
            costs[nextState] = nextCost;
            previous[nextState] = state;
            queue.push({ state: nextState, cost: nextCost, priority: nextCost + heuristic(next) });
        }
    }
    return null;
}
