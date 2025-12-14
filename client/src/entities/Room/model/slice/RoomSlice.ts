import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { fetchRooms } from '../services/fetchRooms';
import type { Room } from '../types/Room';
import type { RoomSchema } from '../types/RoomSchema';

const initialState: RoomSchema = {
    rooms: [],
    isLoading: false,
};

export const RoomSlice = createSlice({
    name: 'RoomSlice',
    initialState,
    reducers: {
        setRooms: (state, action: PayloadAction<Room[]>) => {
            state.rooms = action.payload;
        },
    },
    extraReducers: (builder) =>
        builder
            .addCase(fetchRooms.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchRooms.fulfilled, (state, action: PayloadAction<Room[]>) => {
                state.rooms = action.payload;
                state.isLoading = false;
            }),
});

export const { reducer: RoomReducer, actions: RoomActions } = RoomSlice;
