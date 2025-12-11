import type { Cell, Ship } from '@/entities/Ship';

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

export interface FleetPayload {
    target: 'ownerBoard' | 'enemyBoard';
    fleet: Fleet;
}

export interface GameboardPayload {
    target: 'ownerBoard' | 'enemyBoard';
    board: CellState[][];
}

export interface Room {
    id: string;
    playersLength: number;
}

export interface Leaderboard {
    id: string;
    players: string[];
    winnerName: string;
    createdAt: Date;
    endedAt: Date;
    scores: { [playerName: string]: number };
}

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

    name: string;
    isPlayerReady: boolean;

    phase: BattlePhase;
    currentPlayer: CurrentPlayer;
    room: string | undefined;

    existingRooms?: Room[];
    leaderboard?: Leaderboard[];
}
