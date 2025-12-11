import type { Cell, Ship, ShipOrientation } from '@/entities/Ship';

export const getShipCells = (head: Cell, size: number, orientation: ShipOrientation): Cell[] => {
    const cells: Cell[] = [];
    for (let i = 0; i < size; i++) {
        if (orientation === 'hor') {
            cells.push({ r: head.r + i, c: head.c });
        } else {
            cells.push({ r: head.r, c: head.c + i });
        }
    }
    return cells;
};

export const isShipInBounds = (cells: Cell[]): boolean => {
    return cells.every((cell) => cell.r >= 0 && cell.r < 10 && cell.c >= 0 && cell.c < 10);
};

export const getShipForbiddenZone = (cells: Cell[]): Cell[] => {
    const forbidden = new Set<string>();

    cells.forEach(({ r, c }) => {
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                const nx = r + dx;
                const ny = c + dy;
                if (nx >= 0 && nx < 10 && ny >= 0 && ny < 10) {
                    forbidden.add(`${nx},${ny}`);
                }
            }
        }
    });

    return Array.from(forbidden).map((key) => {
        const [x, y] = key.split(',').map(Number);
        return { r: x, c: y };
    });
};

export const hasCollision = (newCells: Cell[], otherShips: Ship[]): boolean => {
    const allForbidden = new Set<string>();

    otherShips.forEach((ship) => {
        getShipForbiddenZone(ship.cells).forEach((cell) => {
            allForbidden.add(`${cell.r},${cell.c}`);
        });
    });

    return newCells.some((cell) => allForbidden.has(`${cell.r},${cell.c}`));
};
