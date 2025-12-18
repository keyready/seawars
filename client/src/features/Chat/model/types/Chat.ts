export interface ChatMessage {
    sender: string;
    text: string;
    createdAt: Date;
}

export interface Chat {
    roomId: string;
    participants: string[];
    messages: ChatMessage[];
}
