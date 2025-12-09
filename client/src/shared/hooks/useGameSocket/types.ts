import { CellState } from '@/entities/GameBoard';
import type { CurrentPlayer } from '@/entities/GameBoard/model/types/GameBoard';

export interface FireResult {
    pos: { r: number; c: number };
    result: CellState;
    target: string;
    turn?: CurrentPlayer;
    sunkShipId?: string;
}
