import { v4 as uuidv4 } from 'uuid';

import { type Ship, ShipOrientation, type ShipSize } from '@/entities/Ship/model/types/Ship';

export function generateRandomFleet() {
    const SIZE = 10;
    const shipCounts = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1];
    const fleet: Ship[] = [];

    const occupiedCells = new Set();

    function canPlaceShip(r: number, c: number, orientation: ShipOrientation, len: number) {
        const cells = [];
        if (orientation === 'hor') {
            if (c + len > SIZE) return false;
            for (let i = 0; i < len; i++) {
                cells.push({ r, c: c + i });
            }
        } else {
            if (r + len > SIZE) return false;
            for (let i = 0; i < len; i++) {
                cells.push({ r: r + i, c });
            }
        }

        for (const cell of cells) {
            const key = `${cell.r},${cell.c}`;
            if (occupiedCells.has(key)) return false;
        }

        for (const cell of cells) {
            for (let dr = -1; dr <= 1; dr++) {
                for (let dc = -1; dc <= 1; dc++) {
                    const nr = cell.r + dr;
                    const nc = cell.c + dc;
                    if (nr >= 0 && nr < SIZE && nc >= 0 && nc < SIZE) {
                        const key = `${nr},${nc}`;
                        if (occupiedCells.has(key)) return false;
                    }
                }
            }
        }

        return true;
    }

    function placeShip(r: number, c: number, orientation: ShipOrientation, len: number) {
        const cells = [];
        if (orientation === 'hor') {
            for (let i = 0; i < len; i++) {
                cells.push({ r, c: c + i });
            }
        } else {
            for (let i = 0; i < len; i++) {
                cells.push({ r: r + i, c });
            }
        }

        for (const cell of cells) {
            occupiedCells.add(`${cell.r},${cell.c}`);
        }
    }

    function generateShip(len: number) {
        const attempts = 5000; // больше попыток — безопаснее
        for (let i = 0; i < attempts; i++) {
            const r = Math.floor(Math.random() * SIZE);
            const c = Math.floor(Math.random() * SIZE);
            const orientation =
                Math.random() < 0.5 ? ShipOrientation.Horizontal : ShipOrientation.Vertical;

            if (canPlaceShip(r, c, orientation, len)) {
                placeShip(r, c, orientation, len);
                return { orientation, head: { r, c }, size: len as ShipSize };
            }
        }
        throw new Error(`Не удалось разместить ${len}-палубный корабль за ${attempts} попыток`);
    }

    [...shipCounts]
        .sort((a, b) => b - a)
        .forEach((len) => {
            const ship: Ship = {
                ...generateShip(len),
                id: uuidv4(),
                hitCells: [],
            };
            fleet.push(ship);
        });

    return fleet;
}
