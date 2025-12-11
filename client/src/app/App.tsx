import { addToast, cn } from '@heroui/react';

import { useEffect } from 'react';
import { useNavigate } from 'react-router';

import { EnterRoomForm } from '@/widgets/EnterRoomForm';
import { Page } from '@/widgets/Page';

import type { Leaderboard, Room } from '@/entities/GameBoard';
import { GameboardActions } from '@/entities/GameBoard';

import { useAppDispatch } from '@/shared/hooks/useAppDispatch';

import { useSocket } from '@/store/SocketContext';

let isAppSocketEnabled = false;

export function App() {
    const dispatch = useAppDispatch();
    const socket = useSocket();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAppSocketEnabled) return;
        isAppSocketEnabled = true;

        const handleRoomCreated = ({ roomId }: { roomId: string }) => {
            navigate(roomId);
            dispatch(GameboardActions.setGameRoom(roomId));
        };

        const handleError = ({ message }: { message: string }) => {
            addToast({ title: message, color: 'danger' });
        };
        const handleGetRooms = ({ rooms }: { rooms: Room[] }) => {
            dispatch(GameboardActions.setRooms(rooms));
        };

        const handleGetLeaderboard = ({ games }: { games: Leaderboard[] }) => {
            dispatch(GameboardActions.setLeaderBoard(games));
        };

        socket?.on('existing-rooms', handleGetRooms);
        socket?.on('leaderboard', handleGetLeaderboard);
        socket?.on('error', handleError);
        socket?.on('room-created', handleRoomCreated);

        return () => {
            isAppSocketEnabled = false;
            socket?.off('existing-rooms', handleGetRooms);
            socket?.off('leaderboard', handleGetLeaderboard);
            socket?.off('error', handleError);
            socket?.off('room-created', handleRoomCreated);
        };
    }, [dispatch, navigate, socket]);

    return (
        <Page>
            <header className="flex flex-col gap-10 text-center">
                <h1
                    className={cn(
                        'bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text',
                        'text-5xl font-bold italic text-transparent',
                    )}
                >
                    Морской бой
                </h1>
            </header>
            <EnterRoomForm />
        </Page>
    );
}
