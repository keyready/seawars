import type { Ship } from '../../../Ship/model/types/Ship';

export type GameBoardType = 'owner' | 'enemy';

export enum CellState {
    Empty = 'empty',
    Ship = 'ship',
    Miss = 'miss',
    Hit = 'hit',
    Destroyed = 'destroyed',
}

export type Fleet = Ship[];
export type BattlePhase = 'placing' | 'battle';
export type CurrentPlayer = 'me' | 'enemy';
export interface GameBoard {
    grid: CellState[][];
    fleet: Fleet;
}

export interface FleetPayload {
    target: 'ownerBoard' | 'enemyBoard';
    fleet: Fleet;
}

export interface GameboardPayload {
    target: 'ownerBoard' | 'enemyBoard';
    board: CellState[][];
}

export interface GameBoardSchema {
    ownerBoard: GameBoard;
    enemyBoard: GameBoard;

    name: string;

    phase: BattlePhase;
    currentPlayer: CurrentPlayer;
    room: string | undefined;
}
