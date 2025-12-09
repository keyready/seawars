import { CellState } from '../types/GameBoard';

export const createEmptyBoard = (): CellState[][] =>
    Array(10)
        .fill(null)
        .map(() => Array(10).fill(CellState.Empty));
