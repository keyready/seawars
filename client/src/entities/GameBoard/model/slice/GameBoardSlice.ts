import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { createEmptyBoard } from '../lib/createEmptyBoard';
import {
    type BattlePhase,
    type CurrentPlayer,
    type FleetPayload,
    type GameboardPayload,
    type GameBoardSchema,
} from '../types/GameBoard';

const initialState: GameBoardSchema = {
    ownerBoard: {
        grid: createEmptyBoard(),
        fleet: [],
    },
    enemyBoard: {
        grid: createEmptyBoard(),
        fleet: [],
    },
    name: '',
    phase: 'placing',
    currentPlayer: 'me',
    room: undefined,
};

const GameStateSlice = createSlice({
    name: 'GameStateSlice',
    initialState,
    reducers: {
        setFleet: (state, action: PayloadAction<FleetPayload>) => {
            state[action.payload.target].fleet = action.payload.fleet;
        },
        setGameboard: (state, action: PayloadAction<GameboardPayload>) => {
            state[action.payload.target].grid = action.payload.board;
        },
        setPhase: (state, action: PayloadAction<BattlePhase>) => {
            state.phase = action.payload;
        },
        setCurrentTurn: (state, action: PayloadAction<CurrentPlayer>) => {
            state.currentPlayer = action.payload;
        },
        setName: (state, action: PayloadAction<string>) => {
            state.name = action.payload;
        },
        setGameRoom: (state, action: PayloadAction<string>) => {
            state.room = action.payload;
        },
        reset: (state) => {
            state.ownerBoard = {
                grid: createEmptyBoard(),
                fleet: [],
            };
            state.enemyBoard = {
                grid: createEmptyBoard(),
                fleet: [],
            };
            state.name = '';
            state.phase = 'placing';
            state.currentPlayer = 'me';
            state.room = undefined;
        },
    },
});

export const { actions: GameboardActions } = GameStateSlice;
export const { reducer: GameboardReducer } = GameStateSlice;
