import type { ChatMessage } from './Chat';

export interface ChatSchema {
    messages: ChatMessage[];
    currentRoomId?: string;
    isLoading: boolean;
    error?: string;
}
