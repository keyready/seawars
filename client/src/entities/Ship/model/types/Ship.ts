export type Cell = { r: number; c: number };
export type ShipSize = 1 | 2 | 3 | 4;

export enum ShipOrientation {
    Horizontal = 'hor',
    Vertical = 'ver',
}

export interface CellPosition {
    r: number;
    c: number;
}

export interface Ship {
    id: string;

    head: Cell;
    size: ShipSize;
    orientation: ShipOrientation;
    hitCells: Cell[];
    cells: Cell[];
}
