import { cn, Snippet } from '@heroui/react';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';

import { GameboardActions } from '@/entities/GameBoard';
import { getGameRoom } from '@/entities/GameBoard/model/selectors/getGameBoard';
import { Gameboard } from '@/entities/GameBoard/ui/GameBoard';

import { useAppDispatch } from '@/shared/hooks/useAppDispatch';
import { GameSocketActions, getGameSocket } from '@/shared/hooks/useGameSocket';

import { EnterRoomForm } from './Widgets/EnterRoomForm';

// const SOCKET_URL = 'http://192.168.0.187:5000';
const SOCKET_URL = 'http://localhost:5000';

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

        socket?.on('joined-room', ({ name }: { name: string }) => {
            alert(`Joined new player: ${name}`);
        });
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
                    >
                        <div className="mb-10 flex w-full items-center justify-center gap-3">
                            <h2
                                className={cn(
                                    'bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text',
                                    'text-2xl text-transparent italic',
                                )}
                            >
                                Комната
                            </h2>
                            <Snippet className="bg-blue-300" size="sm">
                                {roomId}
                            </Snippet>
                        </div>

                        <div className="flex flex-col items-start justify-center gap-8 md:flex-row">
                            <div className="flex flex-col items-center justify-center gap-6 text-center">
                                <h2 className="mb-2 text-lg font-semibold">Ваш флот</h2>
                                <Gameboard type="me" />
                            </div>

                            <div className="flex flex-col gap-6 text-center">
                                <h2 className="mb-2 text-lg font-semibold">Флот противника</h2>
                                <Gameboard type="enemy" />
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="enter-room-form"
                        initial={{ opacity: 0, y: -50 }}
                        exit={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-1/2"
                    >
                        <EnterRoomForm />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default App;
