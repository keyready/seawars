export interface ChatMessage {
    sender: string;
    receiver: string;
    text: string;
}

export interface Chat {
    roomId: string;
    messages: ChatMessage[];
}
