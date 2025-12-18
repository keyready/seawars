import { createAsyncThunk } from '@reduxjs/toolkit';

import type { ThunkConfig } from '@/app/store';

import type { Room } from '../types/Room';

export const fetchRooms = createAsyncThunk<Room[], void, ThunkConfig<string>>(
    'Room/fetchRooms',
    async (_, thunkApi) => {
        const { extra, rejectWithValue } = thunkApi;

        try {
            const response = await extra.api.get<Room[]>('/api/users/rooms');

            if (!response.data) {
                throw new Error();
            }

            return response.data;
        } catch (e) {
            console.log(e);
            return rejectWithValue('error');
        }
    },
);
