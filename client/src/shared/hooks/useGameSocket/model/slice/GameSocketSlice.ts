import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { Socket } from 'socket.io-client';

import type { GameSocketSchema } from '../types/GameSocketTypes';

const initialState: GameSocketSchema = {
    socket: null,
};

export const GameSocketSlice = createSlice({
    name: 'gameSocketSlice',
    initialState,
    reducers: {
        setSocket: (state, action: PayloadAction<Socket | null>) => {
            // @ts-expect-error some bullshit
            state.socket = action.payload;
        },
    },
});

export const { actions: GameSocketActions } = GameSocketSlice;
export const { reducer: GameSocketReducer } = GameSocketSlice;
