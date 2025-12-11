import { addToast, cn } from '@heroui/react';

import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useNavigate, useParams } from 'react-router';

import { Page } from '@/widgets/Page';

import { DroppableShipBoard, GameboardActions, getCurrentPlayerName } from '@/entities/GameBoard';
import type { Fleet } from '@/entities/GameBoard/model/types/GameBoard';
import type { Cell } from '@/entities/Ship';

import { useAppDispatch } from '@/shared/hooks/useAppDispatch';

import { useSocket } from '@/store/SocketContext';

let isRoomPageSocketEnabled = false;

interface LoadGameStateResponse {
    fleet: Fleet;
    cells: {
        ownerHitCells: Cell[];
        ownerMissCells: Cell[];
        enemyHitCells: Cell[];
        enemyMissCells: Cell[];
    };
}

export default function RoomPage() {
    const { roomId } = useParams<{ roomId: string }>();

    const socket = useSocket();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const name = useSelector(getCurrentPlayerName);

    useEffect(() => {
        if (isRoomPageSocketEnabled) return;
        isRoomPageSocketEnabled = true;

        dispatch(GameboardActions.setGameRoom(roomId!));
        socket?.emit('get-room-info', { roomId, name });

        console.log('init');

        const handleError = ({ message }: { message: string }) => {
            addToast({ title: message, color: 'danger' });
        };

        const handleLoadFleet = ({ fleet, cells }: LoadGameStateResponse) => {
            dispatch(GameboardActions.setOwnerFleet(fleet));

            // cells.ownerMissCells.map((c) => dispatch(GameboardActions.setOwnerMissCells(c)));
            cells.ownerHitCells.map((c) => dispatch(GameboardActions.setOwnerHitCells(c)));
            // cells.enemyMissCells.map((c) => dispatch(GameboardActions.setEnemyMissCells(c)));
            // cells.enemyHitCells.map((c) => dispatch(GameboardActions.setEnemyHitCells(c)));
        };

        socket?.on('error', handleError);
        socket?.on('load-game-state', handleLoadFleet);

        return () => {
            socket?.off('error', handleError);
            socket?.off('load-game-state', handleLoadFleet);
            isRoomPageSocketEnabled = false;
        };
    }, [dispatch, name, navigate, roomId, socket]);

    if (!roomId) return <Navigate to="/" />;

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

            <div className="flex items-start justify-center gap-8 md:flex-row">
                <div className="flex flex-col items-center justify-center gap-6 text-center">
                    <h2 className="mb-2 text-lg font-semibold">Ваш флот</h2>
                    <DroppableShipBoard type="own" />
                </div>

                <div className="flex flex-col gap-6 text-center">
                    <h2 className="mb-2 text-lg font-semibold">Флот противника</h2>
                    <DroppableShipBoard type="enemy" />
                </div>
            </div>
        </Page>
    );
}
