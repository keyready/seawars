import type { Cell } from '@/entities/Ship';

export const isCellUnique = (cells: Cell[], cell: Cell) => {
    const cellKey = `${cell.r}-${cell.c}`;
    const cellsSet = new Set<string>();

    cells.forEach((cell) => cellsSet.add(`${cell.r}-${cell.c}`));
    return !cellsSet.has(cellKey);
};
