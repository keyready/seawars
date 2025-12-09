import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import {
    CellState,
    fleetToGrid,
    GameboardActions,
    generateRandomFleet,
    getCurrentPlayerName,
    getEnemyGameboard,
    getOwnerFleet,
    getOwnerGameboard,
} from '@/entities/GameBoard';
import { setShipDestroyed } from '@/entities/GameBoard/model/lib/setShipDestroyed';
import { getGameRoom } from '@/entities/GameBoard/model/selectors/getGameBoard';
import type { CurrentPlayer } from '@/entities/GameBoard/model/types/GameBoard';

import { useAppDispatch } from '@/shared/hooks/useAppDispatch';

import { getGameSocket } from './model/selectors/getSocket';
import type { FireResult } from './types';

export const useGameActions = () => {
    const dispatch = useAppDispatch();
    const socket = useSelector(getGameSocket);

    const ownerGameboard = useSelector(getOwnerGameboard);
    const ownerFleet = useSelector(getOwnerFleet);
    const enemyGameboard = useSelector(getEnemyGameboard);
    const currentName = useSelector(getCurrentPlayerName);
    const currentRoom = useSelector(getGameRoom);

    const [isPlayerReady, setIsPlayerReady] = useState<boolean>(false);

    useEffect(() => {
        if (!socket) {
            console.warn("Couldn't create socket connection");
            return;
        }

        const handleFireResponse = ({ pos, result, turn }: FireResult) => {
            console.log(`[SOCKET] Fire response:`, { pos, result });

            const updated = [...enemyGameboard];
            updated[pos.r] = [...enemyGameboard[pos.r]];
            updated[pos.r][pos.c] =
                result === CellState.Hit || result === CellState.Destroyed
                    ? CellState.Hit
                    : CellState.Miss;

            console.log('после попадания', updated);

            if (result === CellState.Destroyed) {
                const destroyedShip = setShipDestroyed(updated, pos);
                dispatch(
                    GameboardActions.setGameboard({ board: destroyedShip, target: 'enemyBoard' }),
                );
            } else {
                dispatch(GameboardActions.setGameboard({ board: updated, target: 'enemyBoard' }));
            }
            dispatch(GameboardActions.setCurrentTurn(turn === currentName ? 'me' : 'enemy'));
        };
        const handleIncomingFire = ({ pos, result, target }: FireResult) => {
            console.log(`[SOCKET] Incoming Fire:`, { pos, result });

            if (target === currentName) {
                const updated = [...ownerGameboard];
                updated[pos.r] = [...ownerGameboard[pos.r]];
                updated[pos.r][pos.c] = result;
                dispatch(GameboardActions.setGameboard({ board: updated, target: 'ownerBoard' }));
            }
        };
        const handleTurnChanged = ({ turn }: { turn: CurrentPlayer }) => {
            console.log(`[SOCKET] Turn changed:`, turn);
            dispatch(GameboardActions.setCurrentTurn(turn === currentName ? 'me' : 'enemy'));
        };

        const handleGameStart = ({ turn }: { turn: CurrentPlayer }) => {
            dispatch(GameboardActions.setCurrentTurn(turn === currentName ? 'me' : 'enemy'));
            dispatch(GameboardActions.setPhase('battle'));
        };

        const handleGameOver = ({ winner }: { winner: string }) => {
            dispatch(GameboardActions.reset());
            alert(`Победитель - ${winner}`);
        };

        const handleEndGame = () => {
            console.warn('Кто-то из игроков отключился, комната будет удалена');
            dispatch(GameboardActions.reset());
        };

        socket.on('fire-response', handleFireResponse);
        socket.on('incoming-fire', handleIncomingFire);
        socket.on('turn-changed', handleTurnChanged);
        socket.on('game-end', handleEndGame);
        socket.on('game-over', handleGameOver);
        socket.on('game-start', handleGameStart);
        socket.on('error', ({ message }: { message: string }) => alert(message));

        return () => {
            socket.off('fire-response', handleFireResponse);
            socket.off('incoming-fire', handleIncomingFire);
            socket.off('turn-changed', handleTurnChanged);
            socket.off('game-start');
            socket.off('error');
        };
    }, [currentName, dispatch, enemyGameboard, ownerGameboard, socket]);

    const handleFire = useCallback(
        (r: number, c: number) => {
            console.log(`[SOCKET] Try to sent cell: ${r} - ${c}`);
            if (socket)
                socket.emit('fire', { roomId: currentRoom, player: currentName, pos: { r, c } });
            else console.warn("Couldn't create socket connection");
        },
        [currentName, currentRoom, socket],
    );

    const handleGenerateFleet = useCallback(() => {
        const generatedFleet = generateRandomFleet();
        dispatch(GameboardActions.setFleet({ target: 'ownerBoard', fleet: generatedFleet }));
        dispatch(
            GameboardActions.setGameboard({
                target: 'ownerBoard',
                board: fleetToGrid(generatedFleet),
            }),
        );
    }, [dispatch]);

    const handleSetGameReady = useCallback(() => {
        setIsPlayerReady(true);
        if (socket) {
            socket.emit('submit-fleet', {
                fleet: ownerFleet,
                player: currentName,
                roomId: currentRoom,
            });
        } else console.warn("Couldn't create socket connection");
    }, [currentName, currentRoom, ownerFleet, socket]);

    return {
        generateFleet: handleGenerateFleet,
        startGame: handleSetGameReady,
        fire: handleFire,

        ownerGameboard,
        enemyGameboard,

        isReady: isPlayerReady,
    };
};
