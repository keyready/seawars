import { cn, ScrollShadow } from '@heroui/react';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import { getUserData } from '@/entities/User';

import { Textarea } from '@/shared/ui/Textarea';

import { getChatMessages } from '../model/selectors/chatSelectors';
import { useChatSocket } from '../model/socket/chatSocket';

interface ChatWindowProps {
    roomId?: string;
    playerName?: string;
}

export const ChatWindow = ({ roomId, playerName }: ChatWindowProps) => {
    const username = useSelector(getUserData)?.username || playerName || '';
    const messages = useSelector(getChatMessages);

    const { sendMessage, getChatHistory } = useChatSocket(roomId, username);

    const [newMessage, setNewMessage] = useState<string>('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Получение истории чата при входе в комнату
    useEffect(() => {
        if (roomId && username) {
            getChatHistory();
        }
    }, [roomId, username, getChatHistory]);

    // Авто-скролл к последнему сообщению
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleKeyDown = useCallback(
        (ev: React.KeyboardEvent) => {
            ev.stopPropagation();
            if (ev.ctrlKey && ev.code === 'Enter') {
                if (newMessage.trim()) {
                    sendMessage(newMessage.trim());
                    setNewMessage('');
                }
            }
            if (ev.code === 'Space') {
                ev.preventDefault();
                setNewMessage((ps) => ps + ' ');
            }
        },
        [newMessage, sendMessage],
    );

    return (
        <div
            onClick={(ev) => ev.stopPropagation()}
            className="flex w-full flex-col gap-4 overflow-y-hidden"
        >
            <ScrollShadow className="flex h-[350px] w-full flex-col justify-start gap-1 overflow-y-auto p-1">
                {messages?.length ? (
                    messages.map((msg, index) => (
                        <div
                            className={cn(
                                'flex flex-col rounded-md px-2 py-1',
                                'min-w-[100px] max-w-[150px]',
                                username === msg.sender
                                    ? 'self-end bg-blue-200 text-blue-800'
                                    : 'self-start bg-green-200 text-green-800',
                            )}
                            key={`${msg.createdAt}-${index}`}
                        >
                            <p className="text-justify text-[12px]">{msg.text}</p>
                            <p className="text-[8px]">
                                {new Date(msg.createdAt).toLocaleTimeString('ru-RU', {
                                    minute: '2-digit',
                                    hour: '2-digit',
                                })}
                            </p>
                        </div>
                    ))
                ) : (
                    <div className="flex h-[350px] w-full flex-col items-center justify-center rounded-md bg-sky-200">
                        <p className="text-blue-800">Тут будут сообщений</p>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </ScrollShadow>
            <Textarea
                onValueChange={setNewMessage}
                value={newMessage}
                placeholder="Пишите сюда. Отправить — CTRL + Enter"
                onKeyDown={handleKeyDown}
            />
        </div>
    );
};
