import { createAsyncThunk } from '@reduxjs/toolkit';

import type { LoginSchema, SignupAnswer } from '../types/User';

import type { ThunkConfig } from '@/store/StateSchema';

export const loginUSer = createAsyncThunk<SignupAnswer, LoginSchema, ThunkConfig<string>>(
    'User/loginUSer',
    async (credentials, thunkApi) => {
        const { extra, rejectWithValue } = thunkApi;

        try {
            const response = await extra.api.post<SignupAnswer>('/api/auth/login', credentials);

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
