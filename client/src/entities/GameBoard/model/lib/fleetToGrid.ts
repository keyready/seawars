import { CellState } from '@/entities/GameBoard'; // ← подставь свой путь
import { type CellPosition, type Ship, ShipOrientation } from '@/entities/Ship/model/types/Ship';

export function fleetToGrid(ships: Ship[], size: number = 10): CellState[][] {
    const grid: CellState[][] = Array.from({ length: size }, () =>
        Array(size).fill(CellState.Empty),
    );

    for (const ship of ships) {
        const cells = getShipCells(ship);
        for (const { r, c } of cells) {
            if (r >= 0 && r < size && c >= 0 && c < size) {
                grid[r][c] = CellState.Ship;
            }
        }
    }

    for (const ship of ships) {
        for (const { r, c } of ship.hitCells) {
            if (r >= 0 && r < size && c >= 0 && c < size) {
                grid[r][c] = CellState.Hit;
            }
        }
    }

    return grid;
}

function getShipCells(ship: Ship): CellPosition[] {
    const { head, size, orientation } = ship;
    const cells: CellPosition[] = [];
    for (let i = 0; i < size; i++) {
        if (orientation === ShipOrientation.Horizontal) {
            cells.push({ r: head.r, c: head.c + i });
        } else {
            cells.push({ r: head.r + i, c: head.c });
        }
    }
    return cells;
}
