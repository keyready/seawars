import { cn } from '@heroui/react';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';

import { EnterRoomForm } from '@/widgets/EnterRoomForm';

import type { Leaderboard, Room } from '@/entities/GameBoard';
import { DroppableShipBoard, GameboardActions, getGameRoom } from '@/entities/GameBoard';

import { useAppDispatch } from '@/shared/hooks/useAppDispatch';
import { GameSocketActions, getGameSocket } from '@/shared/hooks/useGameSocket';

const SOCKET_URL = 'http://172.100.1.85:5000';
// const SOCKET_URL = 'http://localhost:5000';

function App() {
    const dispatch = useAppDispatch();

    const roomId = useSelector(getGameRoom);
    const socket = useSelector(getGameSocket);

    useEffect(() => {
        const socket = io(SOCKET_URL, {
            transports: ['websocket'],
            reconnection: true,
        });

        socket.on('connect', () => {
            console.log(`[SOCKET] ✅ Connected. ID: ${socket.id}`);
        });

        dispatch(GameSocketActions.setSocket(socket));

        return () => {
            console.log('[SOCKET] 🔌 Disconnecting...');
            dispatch(GameSocketActions.setSocket(null));
            socket.close();
        };
    }, [dispatch]);

    useEffect(() => {
        socket?.on('room-created', ({ roomId }: { roomId: string }) => {
            console.log(roomId);
            dispatch(GameboardActions.setGameRoom(roomId));
        });

        const handleGetRooms = ({ rooms }: { rooms: Room[] }) => {
            dispatch(GameboardActions.setRooms(rooms));
        };

        const handleGetLeaderboard = ({ games }: { games: Leaderboard[] }) => {
            dispatch(GameboardActions.setLeaderBoard(games));
        };

        socket?.on('existing-rooms', handleGetRooms);
        socket?.on('leaderboard', handleGetLeaderboard);
    }, [dispatch, socket]);

    return (
        <div
            className={cn(
                'h-screen w-full bg-slate-900 font-sans text-white selection:bg-cyan-500 selection:text-white',
                'flex flex-col items-center justify-center gap-10',
            )}
        >
            <header className="flex flex-col gap-10 text-center">
                <h1
                    className={cn(
                        'bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text',
                        'text-5xl font-bold text-transparent italic',
                    )}
                >
                    Морской бой
                </h1>
            </header>

            <AnimatePresence mode="wait">
                {roomId ? (
                    <motion.div
                        key="game-room"
                        initial={{ opacity: 0, y: -50 }}
                        exit={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-start justify-center gap-8 md:flex-row"
                    >
                        <div className="flex flex-col items-center justify-center gap-6 text-center">
                            <h2 className="mb-2 text-lg font-semibold">Ваш флот</h2>
                            <DroppableShipBoard type="own" />
                        </div>

                        <div className="flex flex-col gap-6 text-center">
                            <h2 className="mb-2 text-lg font-semibold">Флот противника</h2>
                            <DroppableShipBoard type="enemy" />
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="enter-room-form"
                        initial={{ opacity: 0, y: -50 }}
                        exit={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full"
                    >
                        <EnterRoomForm />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default App;
