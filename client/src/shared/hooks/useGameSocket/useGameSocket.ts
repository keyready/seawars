import { useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';

import {
    CellState,
    type CurrentPlayer,
    GameboardActions,
    getCurrentPlayerName,
    getEnemyGameboard,
    getGameRoom,
    getOwnerFleet,
    getOwnerGameboard,
    getSkirtAroundDestroyedShip,
} from '@/entities/GameBoard';
import type { Cell } from '@/entities/Ship';

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

    useEffect(() => {
        if (!socket) {
            console.warn("Couldn't create socket connection");
            return;
        }

        const handleFireResponse = ({ pos, result }: FireResult) => {
            console.log(`[SOCKET] Fire response:`, { pos, result });

            if (result === CellState.Miss) {
                dispatch(GameboardActions.setEnemyMissCells(pos));
                return;
            }

            if (result === CellState.Hit) {
                dispatch(GameboardActions.setEnemyHitCells(pos));
                return;
            }

            if (result === CellState.Destroyed) {
                dispatch(GameboardActions.setEnemyHitCells(pos));

                const skirtAroundDestroyedShip = getSkirtAroundDestroyedShip(
                    [...enemyGameboard.hitCells, pos],
                    pos,
                );

                skirtAroundDestroyedShip.map((cell) =>
                    dispatch(GameboardActions.setEnemyMissCells(cell)),
                );
            }
        };

        const handleIncomingFire = ({ pos, result }: FireResult) => {
            console.log(`[SOCKET] Incoming Fire:`, { pos, result });

            if (result === CellState.Miss) {
                dispatch(GameboardActions.setOwnerMissCells(pos));
                return;
            }

            if (result === CellState.Hit) {
                dispatch(GameboardActions.setOwnerHitCells(pos));
                return;
            }

            if (result === CellState.Destroyed) {
                dispatch(GameboardActions.setOwnerHitCells(pos));

                const skirtAroundDestroyedShip = getSkirtAroundDestroyedShip(
                    [...ownerGameboard.hitCells, pos],
                    pos,
                );

                skirtAroundDestroyedShip.map((cell) =>
                    dispatch(GameboardActions.setOwnerMissCells(cell)),
                );
            }
        };

        const handleTurnChanged = ({ turn }: { turn: CurrentPlayer }) => {
            console.log(`[SOCKET] Turn changed:`, turn);
            dispatch(GameboardActions.setCurrentTurn(turn === currentName ? 'me' : 'enemy'));
            dispatch(GameboardActions.setPhase('battle'));
        };

        const handleGameStart = ({ turn }: { turn: CurrentPlayer }) => {
            dispatch(GameboardActions.setCurrentTurn(turn === currentName ? 'me' : 'enemy'));
            dispatch(GameboardActions.setPhase('battle'));
        };

        const handleGameOver = ({ winner }: { winner: string }) => {
            dispatch(GameboardActions.reset());
            if (currentRoom) alert(`Победитель - ${winner}`);
        };

        const handleEndGame = () => {
            console.warn('Кто-то из игроков отключился, комната будет удалена');
            dispatch(GameboardActions.reset());
        };

        socket.on('fire-response', handleFireResponse);
        socket.on('incoming-fire', handleIncomingFire);
        socket.on('turn-changed', handleTurnChanged);
        socket.on('game-start', handleGameStart);
        socket.on('game-end', handleEndGame);
        socket.on('game-over', handleGameOver);
        socket.on('error', ({ message }: { message: string }) => alert(message));

        return () => {
            socket.off('fire-response', handleFireResponse);
            socket.off('incoming-fire', handleIncomingFire);
            socket.off('turn-changed', handleTurnChanged);
            socket.off('game-start', handleGameStart);
            socket.off('game-end', handleEndGame);
            socket.off('game-over', handleGameOver);
            socket.off('error');
        };
    }, [currentName, currentRoom, dispatch, enemyGameboard, ownerGameboard, socket]);

    const handleFire = useCallback(
        (cell: Cell) => {
            console.log(`[SOCKET] Try to sent cell: ${cell.r} - ${cell.c}`);
            if (socket)
                socket.emit('fire', { roomId: currentRoom, player: currentName, pos: cell });
            else console.warn("Couldn't create socket connection");
        },
        [currentName, currentRoom, socket],
    );

    const handleSetGameReady = useCallback(() => {
        if (socket) {
            dispatch(GameboardActions.setPlayerReady());
            socket.emit('submit-fleet', {
                fleet: ownerFleet,
                player: currentName,
                roomId: currentRoom,
            });
        } else console.warn("Couldn't create socket connection");
    }, [currentName, currentRoom, dispatch, ownerFleet, socket]);

    return {
        startGame: handleSetGameReady,
        fire: handleFire,

        ownerGameboard,
        enemyGameboard,
    };
};
