import { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { useSocket } from '@/app/store/SocketContext';

import { ChatActions } from '../slice/ChatSlice';
import type { ChatMessage } from '../types/Chat';

export const useChatSocket = (roomId?: string, playerName?: string) => {
    const socket = useSocket();
    const dispatch = useDispatch();

    // Установка комнаты для чата
    const setRoom = useCallback(
        (roomId: string) => {
            dispatch(ChatActions.setRoom(roomId));
        },
        [dispatch],
    );

    // Отправка сообщения
    const sendMessage = useCallback(
        (message: string) => {
            if (!socket || !roomId || !playerName) return;

            socket.emit('send-message', {
                roomId,
                message,
                player: playerName,
            });
        },
        [socket, roomId, playerName],
    );

    // Получение истории чата при входе в комнату
    const getChatHistory = useCallback(() => {
        if (!socket || !roomId || !playerName) return;

        socket.emit('get-chat-history', {
            roomId,
            player: playerName,
        });
    }, [socket, roomId, playerName]);

    // Обработка входящих сообщений
    useEffect(() => {
        if (!socket) return;

        const handleNewMessage = (message: ChatMessage) => {
            dispatch(ChatActions.addMessage(message));
        };

        const handleChatHistory = (messages: ChatMessage[]) => {
            dispatch(ChatActions.setMessages(messages));
        };

        socket.on('new-message', handleNewMessage);
        socket.on('chat-history', handleChatHistory);

        return () => {
            socket.off('new-message', handleNewMessage);
            socket.off('chat-history', handleChatHistory);
        };
    }, [socket, dispatch]);

    // Очистка чата при выходе из комнаты
    const clearChat = useCallback(() => {
        dispatch(ChatActions.clearChat());
    }, [dispatch]);

    return {
        sendMessage,
        getChatHistory,
        setRoom,
        clearChat,
    };
};
