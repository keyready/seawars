import { createAsyncThunk } from '@reduxjs/toolkit';

import type { Room } from '../types/Room';

import type { ThunkConfig } from '@/store/StateSchema';

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
