import type { StateSchema } from '@/store/StateSchema';

export const getChatMessages = (state: StateSchema) => state.chat.messages;
export const getCurrentRoomId = (state: StateSchema) => state.chat.currentRoomId;
export const getChatIsLoading = (state: StateSchema) => state.chat.isLoading;
export const getChatError = (state: StateSchema) => state.chat.error;
