import { addToast } from '@heroui/react';

import { useCallback, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

import { useSocket } from '@/app/store/SocketContext';

import type { Fleet } from '@/entities/GameBoard';
import {
    CellState,
    type CurrentPlayer,
    GameboardActions,
    getEnemyGameboard,
    getGameRoom,
    getOwnerFleet,
    getOwnerGameboard,
    getSkirtAroundDestroyedShip,
} from '@/entities/GameBoard';
import { type Leaderboard, LeaderboardActions } from '@/entities/Leaderboard';
import { type Room, RoomActions } from '@/entities/Room';
import type { Cell } from '@/entities/Ship';
import { getUserData, type UserRankKeys, userRankMapper } from '@/entities/User';
import { getMe } from '@/entities/User/model/services/getUserData';

import { useAppDispatch } from '@/shared/hooks/useAppDispatch';

interface FireResult {
    pos: { r: number; c: number };
    result: CellState;
    target: string;
    turn?: CurrentPlayer;
    sunkShipId?: string;
}

interface LoadGameStateResponse {
    fleet: Fleet;
    cells: {
        ownerHitCells: Cell[];
        ownerMissCells: Cell[];
        enemyHitCells: Cell[];
        enemyMissCells: Cell[];
    };
}

interface RatingChange {
    delta: number;
    rankChanged: boolean;
    newRank: UserRankKeys;
}

interface RatingChanges {
    [playerName: string]: RatingChange;
}

let isHandlersRegistered = false;

export const useGameActions = () => {
    const dispatch = useAppDispatch();
    const socket = useSocket();
    const navigate = useNavigate();

    const ownerGameboard = useSelector(getOwnerGameboard);
    const ownerFleet = useSelector(getOwnerFleet);
    const enemyGameboard = useSelector(getEnemyGameboard);
    const currentName = useSelector(getUserData)?.username || '';
    const currentRoom = useSelector(getGameRoom);

    const stateRef = useRef({
        dispatch,
        navigate,
        ownerGameboard,
        enemyGameboard,
        currentName,
        currentRoom,
    });

    useEffect(() => {
        stateRef.current = {
            dispatch,
            navigate,
            ownerGameboard,
            enemyGameboard,
            currentName,
            currentRoom,
        };
    }, [dispatch, navigate, ownerGameboard, enemyGameboard, currentName, currentRoom]);

    useEffect(() => {
        if (!socket) return;

        let attemptCount = 0;
        const maxAttempts = 3;
        const intervalMs = 5000;
        let timeoutId: number | null = null;
        let hasShownError = false;

        const checkConnection = () => {
            if (socket.connected) {
                attemptCount = 0;
                hasShownError = false;
                if (timeoutId) {
                    clearTimeout(timeoutId);
                    timeoutId = null;
                }
                return;
            }

            attemptCount++;
            console.log(`[SOCKET] Проверка соединения ${attemptCount}/${maxAttempts}`);

            if (attemptCount >= maxAttempts && !hasShownError) {
                hasShownError = true;
                addToast({
                    color: 'danger',
                    title: 'Сервер недоступен',
                    description:
                        'Не удалось установить соединение с сервером. Пожалуйста, обратитесь к фиксикам.',
                    timeout: 3000,
                });
                if (timeoutId) {
                    clearTimeout(timeoutId);
                    timeoutId = null;
                }
                return;
            }

            if (attemptCount < maxAttempts) {
                timeoutId = setTimeout(() => {
                    checkConnection();
                }, intervalMs);
            }
        };

        if (!socket.connected) {
            checkConnection();
        }

        const handleConnect = () => {
            attemptCount = 0;
            hasShownError = false;
            if (timeoutId) {
                clearTimeout(timeoutId);
                timeoutId = null;
            }
        };

        const handleDisconnect = () => {
            attemptCount = 0;
            hasShownError = false;
            checkConnection();
        };

        socket.on('connect', handleConnect);
        socket.on('disconnect', handleDisconnect);

        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            socket.off('connect', handleConnect);
            socket.off('disconnect', handleDisconnect);
        };
    }, [socket]);


    const handleWeaknessSupportRequest = useCallback(
        (line: number) => {
            const params = {
                roomId: currentRoom,
                player: currentName,
                helpType: 'airforces',
                helpParams: { horLine: line },
            };
            if (socket) {
                socket.emit('weakness-support', params);
            } else {
                console.warn("Couldn't create socket connection");
            }
        },
        [currentName, currentRoom, socket],
    );

    const handlePlayerLeaveRoom = useCallback(() => {
        console.log(`[SOCKET] Player left the room`);
        dispatch(GameboardActions.reset());
        if (socket) {
            socket.emit('player-left-room', { roomId: currentRoom, player: currentName });
        } else {
            console.warn("Couldn't create socket connection");
        }
    }, [currentName, currentRoom, dispatch, socket]);

    const handleFire = useCallback(
        (cell: Cell) => {
            console.log(`[SOCKET] Try to sent cell: ${cell.r} - ${cell.c}`);
            if (socket) {
                socket.emit('fire', { roomId: currentRoom, player: currentName, pos: cell });
            } else {
                console.warn("Couldn't create socket connection");
            }
        },
        [currentName, currentRoom, socket],
    );

    const handleCheatsEnablingRequest = () => {
        if (socket) {
            socket.emit('cheat-request', {
                player: currentName,
                roomId: currentRoom,
            });
        } else {
            console.warn("Couldn't create socket connection");
        }
    };

    const handleSetGameReady = useCallback(() => {
        if (socket) {
            dispatch(GameboardActions.setPlayerReady());
            socket.emit('submit-fleet', {
                fleet: ownerFleet,
                player: currentName,
                roomId: currentRoom,
            });
        } else {
            console.warn("Couldn't create socket connection");
        }
    }, [currentName, currentRoom, dispatch, ownerFleet, socket]);

    const createRoom = useCallback(
        (name: string) => {
            if (socket) {
                socket.emit('create-room', { name });
            } else {
                console.warn("Couldn't create socket connection");
            }
        },
        [socket],
    );

    const joinRoom = useCallback(
        (roomId: string, name: string) => {
            if (socket) {
                socket.emit('join-room', { roomId, name });
            } else {
                console.warn("Couldn't create socket connection");
            }
        },
        [socket],
    );

    const getRoomInfo = useCallback(
        (roomId: string, name: string) => {
            if (socket) {
                dispatch(GameboardActions.setGameRoom(roomId));
                socket.emit('get-room-info', { roomId, name });
            } else {
                console.warn("Couldn't create socket connection");
            }
        },
        [dispatch, socket],
    );

    const handleBombDropRequest = useCallback(
        (center: Cell) => {
            const params = {
                roomId: currentRoom,
                player: currentName,
                helpType: 'bomb',
                helpParams: { center },
            };
            if (socket) {
                socket.emit('weakness-support', params);
            } else {
                console.warn("Couldn't create socket connection");
            }
        },
        [currentName, currentRoom, socket],
    );

    return {
        startGame: handleSetGameReady,
        getHelp: handleCheatsEnablingRequest,
        fire: handleFire,
        createRoom,
        joinRoom,
        getRoomInfo,
        ownerGameboard,
        enemyGameboard,
        handlePlayerLeaveRoom,
        requestWeaknessSupport: handleWeaknessSupportRequest,
        requestBombDrop: handleBombDropRequest,
    };
};

// Хук для глобальных обработчиков сокетов (создание комнат и т.д.)
export const useGlobalSocketHandlers = () => {
    const dispatch = useAppDispatch();
    const socket = useSocket();
    const navigate = useNavigate();

    const stateRef = useRef({
        dispatch,
        navigate,
    });

    useEffect(() => {
        stateRef.current = {
            dispatch,
            navigate,
        };
    }, [dispatch, navigate]);

    useEffect(() => {
        if (!socket) return;

        const handleRoomCreated = ({ roomId }: { roomId: string }) => {
            const state = stateRef.current;
            state.navigate('/battle/' + roomId);
            state.dispatch(GameboardActions.setGameRoom(roomId));
        };

        const handleError = ({ message }: { message: string }) => {
            addToast({ title: message, color: 'danger' });
        };

        socket.on('room-created', handleRoomCreated);
        socket.on('error', handleError);

        return () => {
            socket.off('room-created', handleRoomCreated);
            socket.off('error', handleError);
        };
    }, [socket]);
};

// Хук для регистрации обработчиков сокетов (используется только в RoomPage)
export const useGameSocketHandlers = () => {
    const dispatch = useAppDispatch();
    const socket = useSocket();
    const navigate = useNavigate();

    const ownerGameboard = useSelector(getOwnerGameboard);
    const enemyGameboard = useSelector(getEnemyGameboard);
    const currentName = useSelector(getUserData)?.username || '';
    const currentRoom = useSelector(getGameRoom);

    const stateRef = useRef({
        dispatch,
        navigate,
        ownerGameboard,
        enemyGameboard,
        currentName,
        currentRoom,
    });

    useEffect(() => {
        stateRef.current = {
            dispatch,
            navigate,
            ownerGameboard,
            enemyGameboard,
            currentName,
            currentRoom,
        };
    }, [dispatch, navigate, ownerGameboard, enemyGameboard, currentName, currentRoom]);

    useEffect(() => {
        if (!socket || isHandlersRegistered) return;

        isHandlersRegistered = true;

        const handleFireResponse = ({ pos, result }: FireResult) => {
            const state = stateRef.current;
            console.log(`[SOCKET] Fire response:`, { pos, result });

            if (result === CellState.Miss) {
                state.dispatch(GameboardActions.setEnemyMissCells(pos));
                return;
            }

            if (result === CellState.Hit) {
                state.dispatch(GameboardActions.setEnemyHitCells(pos));
                return;
            }

            if (result === CellState.Destroyed) {
                state.dispatch(GameboardActions.setEnemyHitCells(pos));

                const skirtAroundDestroyedShip = getSkirtAroundDestroyedShip(
                    [...state.enemyGameboard.hitCells, pos],
                    pos,
                );

                skirtAroundDestroyedShip.map((cell) =>
                    state.dispatch(GameboardActions.setEnemyMissCells(cell)),
                );
            }
        };

        const handleIncomingFire = ({ pos, result }: FireResult) => {
            const state = stateRef.current;
            console.log(`[SOCKET] Incoming Fire:`, { pos, result });

            if (result === CellState.Miss) {
                state.dispatch(GameboardActions.setOwnerMissCells(pos));
                return;
            }

            if (result === CellState.Hit) {
                state.dispatch(GameboardActions.setOwnerHitCells(pos));
                return;
            }

            if (result === CellState.Destroyed) {
                state.dispatch(GameboardActions.setOwnerHitCells(pos));

                const skirtAroundDestroyedShip = getSkirtAroundDestroyedShip(
                    [...state.ownerGameboard.hitCells, pos],
                    pos,
                );

                skirtAroundDestroyedShip.map((cell) =>
                    state.dispatch(GameboardActions.setOwnerMissCells(cell)),
                );
            }
        };

        const handleTurnChanged = ({ turn }: { turn: CurrentPlayer }) => {
            const state = stateRef.current;
            console.log(`[SOCKET] Turn changed:`, turn);
            state.dispatch(
                GameboardActions.setCurrentTurn(turn === state.currentName ? 'me' : 'enemy'),
            );
            state.dispatch(GameboardActions.setPhase('battle'));
        };

        const handleGameStart = ({ turn }: { turn: CurrentPlayer }) => {
            const state = stateRef.current;
            state.dispatch(
                GameboardActions.setCurrentTurn(turn === state.currentName ? 'me' : 'enemy'),
            );
            state.dispatch(GameboardActions.setPhase('battle'));
            addToast({ color: 'secondary', title: 'Игра началась!' });
        };

        const handleGameOver = ({
            winner,
            ratingChanges,
        }: {
            winner: string;
            ratingChanges?: RatingChanges;
        }) => {
            const state = stateRef.current;
            state.dispatch(GameboardActions.reset());

            addToast({ color: 'success', title: `Победитель - ${winner}` });

            if (ratingChanges) {
                const currentUser = state.currentName;

                if (currentUser && ratingChanges[currentUser]) {
                    const { delta, rankChanged, newRank } = ratingChanges[currentUser];
                    const deltaText = delta > 0 ? `+${delta}` : delta.toString();

                    if (rankChanged) {
                        addToast({
                            color: 'success',
                            title: `Поздравляем! Новое звание: ${userRankMapper[newRank]}`,
                            description: `Рейтинг изменён на ${deltaText} очков`,
                            timeout: 5000,
                        });
                    } else {
                        addToast({
                            color: delta > 0 ? 'success' : 'danger',
                            title: `Рейтинг изменён на ${deltaText} очков`,
                            timeout: 5000,
                        });
                    }
                }

                const opponentName = Object.keys(ratingChanges).find(
                    (name) => name !== currentUser,
                );
                if (opponentName && ratingChanges[opponentName]) {
                    const { delta, rankChanged, newRank } = ratingChanges[opponentName];

                    if (rankChanged) {
                        addToast({
                            color: 'secondary',
                            title: `${opponentName} получил новое звание: ${userRankMapper[newRank]}`,
                            description: `Рейтинг изменён на ${delta > 0 ? '+' : ''}${delta} очков`,
                            timeout: 5000,
                        });
                    }
                }
            }

            state.dispatch(getMe());

            state.navigate('/');
        };

        const handleEndGame = () => {
            const state = stateRef.current;
            console.warn('Кто-то из игроков отключился, комната будет удалена');
            state.dispatch(GameboardActions.reset());
        };

        const handlePlayerJoined = ({ player }: { player: string }) => {
            addToast({ color: 'warning', title: `В комнату зашел ${player}` });
        };

        const handlePlayerLeave = ({ player }: { player: string }) => {
            addToast({ color: 'danger', title: `${player} покинул игру` });
        };

        const handleGetRooms = (rooms: Room[]) => {
            const state = stateRef.current;
            console.log('Получил комнаты', rooms);
            state.dispatch(RoomActions.setRooms(rooms));
        };

        const handleGetLeaderboard = (games: Leaderboard[]) => {
            const state = stateRef.current;
            state.dispatch(LeaderboardActions.setLeaderBoard(games));
        };

        const handleJoinedRoom = ({ roomId }: { roomId: string }) => {
            console.log(roomId);
        };

        const handleLoadGameState = ({ fleet, cells }: LoadGameStateResponse) => {
            const state = stateRef.current;
            state.dispatch(GameboardActions.setOwnerFleet(fleet));
            cells.ownerHitCells.map((c) => state.dispatch(GameboardActions.setOwnerHitCells(c)));
        };

        const handleError = ({ message }: { message: string }) => {
            addToast({ title: message, color: 'danger' });
        };

        const handleSystemMessage = ({ message }: { message: string }) => {
            addToast({ title: message, color: 'secondary', timeout: 2000 });
        };

        const handlePlayerSubmitFleet = ({ player }: { player: string }) => {
            addToast({ title: `Игрок ${player} к бою готов!`, color: 'success' });
        };

        const handleCheatResponse = ({ enemyFleet }: { enemyFleet: Fleet }) => {
            const state = stateRef.current;
            addToast({ title: 'Эхх...', color: 'danger' });
            state.dispatch(GameboardActions.setEnemyFleet(enemyFleet));
        };

        socket.on('fleet-submitted', handlePlayerSubmitFleet);
        socket.on('fire-response', handleFireResponse);
        socket.on('incoming-fire', handleIncomingFire);
        socket.on('turn-changed', handleTurnChanged);
        socket.on('game-start', handleGameStart);
        socket.on('player-joined', handlePlayerJoined);
        socket.on('leave-room', handlePlayerLeave);
        socket.on('game-end', handleEndGame);
        socket.on('game-over', handleGameOver);
        socket.on('existing-rooms', handleGetRooms);
        socket.on('leaderboard', handleGetLeaderboard);
        socket.on('error', handleError);
        socket.on('system', handleSystemMessage);
        socket.on('cheat-answer', handleCheatResponse);
        socket.on('joined-room', handleJoinedRoom);
        socket.on('load-game-state', handleLoadGameState);

        return () => {
            isHandlersRegistered = false;
            socket.off('fleet-submitted', handlePlayerSubmitFleet);
            socket.off('fire-response', handleFireResponse);
            socket.off('incoming-fire', handleIncomingFire);
            socket.off('turn-changed', handleTurnChanged);
            socket.off('game-start', handleGameStart);
            socket.off('player-joined', handlePlayerJoined);
            socket.off('leave-room', handlePlayerLeave);
            socket.off('cheat-answer', handleCheatResponse);
            socket.off('game-end', handleEndGame);
            socket.off('game-over', handleGameOver);
            socket.off('existing-rooms', handleGetRooms);
            socket.off('leaderboard', handleGetLeaderboard);
            socket.off('error', handleError);
            socket.off('system', handleSystemMessage);
            socket.off('joined-room', handleJoinedRoom);
            socket.off('load-game-state', handleLoadGameState);
        };
    }, [socket]);
};
