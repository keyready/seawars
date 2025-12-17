import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { Cell } from '@/entities/Ship';
import { ShipOrientation, type ShipSize } from '@/entities/Ship';

import { generateShips } from '../lib/generateFleetInitialPositions';
import { isCellUnique } from '../lib/isCellUnique';
import { getShipCells } from '../lib/utils';
import {
    type BattlePhase,
    type CurrentPlayer,
    type Fleet,
    type GameBoardSchema,
} from '../types/GameBoard';

const initialOwnerFleet: Fleet = generateShips()
    .reverse()
    .map((ship, index) => {
        const head = { r: 10, c: 9 - index };
        return {
            id: ship.id,
            size: ship.size as ShipSize,
            orientation: ShipOrientation.Horizontal,
            head,
            cells: getShipCells(head, ship.size, ShipOrientation.Horizontal),
            hitCells: [],
        };
    });

const initialState: GameBoardSchema = {
    ownerBoard: {
        grid: { missCells: [], hitCells: [] },
        fleet: initialOwnerFleet,
    },
    enemyBoard: {
        missCells: [],
        hitCells: [],
    },

    isPlayerReady: false,
    phase: 'placing',
    currentPlayer: 'me',

    room: undefined,
    existingRooms: undefined,
};

const GameStateSlice = createSlice({
    name: 'GameStateSlice',
    initialState,
    reducers: {
        // cheat
        setEnemyFleet: (state, action: PayloadAction<Fleet>) => {
            state.enemyFleet = action.payload;
        },

        setEnemyMissCells: (state, action: PayloadAction<Cell>) => {
            if (isCellUnique(state.enemyBoard.missCells, action.payload)) {
                state.enemyBoard.missCells = [...state.enemyBoard.missCells, action.payload];
            }
        },
        setEnemyHitCells: (state, action: PayloadAction<Cell>) => {
            if (isCellUnique(state.enemyBoard.hitCells, action.payload)) {
                state.enemyBoard.hitCells = [...state.enemyBoard.hitCells, action.payload];
            }
        },
        setOwnerMissCells: (state, action: PayloadAction<Cell>) => {
            if (isCellUnique(state.ownerBoard.grid.missCells, action.payload)) {
                state.ownerBoard.grid.missCells = [
                    ...state.ownerBoard.grid.missCells,
                    action.payload,
                ];
            }
        },
        setOwnerHitCells: (state, action: PayloadAction<Cell>) => {
            if (isCellUnique(state.ownerBoard.grid.hitCells, action.payload)) {
                state.ownerBoard.grid.hitCells = [
                    ...state.ownerBoard.grid.hitCells,
                    action.payload,
                ];
            }
        },

        setOwnerFleet: (state, action: PayloadAction<Fleet>) => {
            state.ownerBoard.fleet = action.payload;
        },

        setPlayerReady: (state) => {
            state.isPlayerReady = true;
        },

        // old
        setPhase: (state, action: PayloadAction<BattlePhase>) => {
            state.phase = action.payload;
        },
        setCurrentTurn: (state, action: PayloadAction<CurrentPlayer>) => {
            state.currentPlayer = action.payload;
        },
        setGameRoom: (state, action: PayloadAction<string>) => {
            state.room = action.payload;
        },
        reset: (state) => {
            state.ownerBoard = {
                grid: { hitCells: [], missCells: [] },
                fleet: [],
            };
            state.enemyBoard = {
                hitCells: [],
                missCells: [],
            };
            state.phase = 'placing';
            state.currentPlayer = 'me';
            state.room = undefined;
            state.isPlayerReady = false;
        },
    },
});

export const { actions: GameboardActions } = GameStateSlice;
export const { reducer: GameboardReducer } = GameStateSlice;
