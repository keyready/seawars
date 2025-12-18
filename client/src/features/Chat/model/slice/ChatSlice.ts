import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { ChatMessage } from '../types/Chat';
import type { ChatSchema } from '../types/ChatSchema';

const initialState: ChatSchema = {
    messages: [],
    isLoading: false,
    error: undefined,
};

export const ChatSlice = createSlice({
    name: 'ChatSlice',
    initialState,
    reducers: {
        setRoom: (state, action: PayloadAction<string>) => {
            state.currentRoomId = action.payload;
            state.messages = [];
        },

        addMessage: (state, action: PayloadAction<ChatMessage>) => {
            state.messages.push(action.payload);
        },

        setMessages: (state, action: PayloadAction<ChatMessage[]>) => {
            state.messages = action.payload;
        },

        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },

        setError: (state, action: PayloadAction<string | undefined>) => {
            state.error = action.payload;
        },

        clearChat: (state) => {
            state.messages = [];
            state.currentRoomId = undefined;
            state.error = undefined;
        },
    },
});

export const { reducer: ChatReducer, actions: ChatActions } = ChatSlice;
