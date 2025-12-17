import type { Room } from '@/entities/Room';
import type { Cell, Ship } from '@/entities/Ship';

export type GameBoardType = 'owner' | 'enemy';

export enum CellState {
    Ship = 'ship',
    Miss = 'miss',
    Hit = 'hit',
    Destroyed = 'destroyed',
}

export type Fleet = Ship[];
export type BattlePhase = 'placing' | 'battle';
export type CurrentPlayer = 'me' | 'enemy';

export interface GameboardCellsState {
    hitCells: Cell[];
    missCells: Cell[];
}

export interface GameBoard {
    grid: GameboardCellsState;
    fleet: Fleet;
}

export interface GameBoardSchema {
    ownerBoard: GameBoard;
    enemyBoard: GameboardCellsState;

    isPlayerReady: boolean;

    phase: BattlePhase;
    currentPlayer: CurrentPlayer;
    room: string | undefined;

    existingRooms?: Room[];
}
