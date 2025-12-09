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

    head: CellPosition;
    size: ShipSize;
    orientation: ShipOrientation;
    hitCells: CellPosition[];
}

export enum CellStatus {
    Intact = 'intact', // целая
    Damaged = 'damaged', // подстрелена
}
