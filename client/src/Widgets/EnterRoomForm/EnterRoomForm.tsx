import { Button, cn, Divider, Input } from '@heroui/react';

import { type FormEvent, useCallback, useState } from 'react';
import { useSelector } from 'react-redux';

import { GameboardActions, getCurrentPlayerName } from '@/entities/GameBoard';
import { getGamingRooms, getLeaderboards } from '@/entities/GameBoard/model/selectors/getGameBoard';

import { useAppDispatch } from '@/shared/hooks/useAppDispatch';
import { getGameSocket } from '@/shared/hooks/useGameSocket';

export const EnterRoomForm = () => {
    const dispatch = useAppDispatch();

    const currentName = useSelector(getCurrentPlayerName);
    const gamingRooms = useSelector(getGamingRooms);
    const leaderboard = useSelector(getLeaderboards);
    const socket = useSelector(getGameSocket);

    const [selectedRoom, setSelectedRoom] = useState<string>('');

    const handleChangeRoomId = useCallback((val: string) => {
        setSelectedRoom(val);
    }, []);

    const handleNameChange = useCallback(
        (val: string) => {
            dispatch(GameboardActions.setName(val));
        },
        [dispatch],
    );

    const handleJoinRoom = useCallback(
        (ev: FormEvent<HTMLFormElement>) => {
            ev.preventDefault();
            dispatch(GameboardActions.setGameRoom(selectedRoom));
            socket?.emit('join-room', { roomId: selectedRoom, name: currentName });
        },
        [currentName, dispatch, selectedRoom, socket],
    );

    const handleCopyRoomId = useCallback((id: string) => {
        if (navigator.clipboard && window.isSecureContext) {
            alert('ID комнаты скопирован');
            return navigator.clipboard.writeText(id);
        } else {
            const textarea = document.createElement('textarea');
            textarea.value = id;
            textarea.style.position = 'fixed';
            textarea.style.left = '-9999px';
            document.body.appendChild(textarea);
            textarea.focus();
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            alert('ID комнаты скопирован');
            return Promise.resolve();
        }
    }, []);

    return (
        <div className="flex w-full flex-col items-center justify-center gap-5 px-4 py-8">
            <div
                className={cn(
                    'flex min-h-1/2 w-4/5 flex-col items-center justify-center lg:w-3/5 xl:w-1/2',
                    'rounded-md bg-gradient-to-r from-cyan-800 to-blue-900 px-5 py-10',
                )}
            >
                <form className="flex w-full items-center justify-center gap-2">
                    <Input label="Ваше имя" value={currentName} onValueChange={handleNameChange} />
                    <Button
                        color="success"
                        onPress={() => socket?.emit('create-room', { name: currentName })}
                    >
                        Создать комнату
                    </Button>
                </form>
                <Divider className="my-2 h-0.5 w-full bg-gradient-to-r from-cyan-700 to-blue-700" />
                <p>или</p>
                <form className="flex flex-col gap-4" onSubmit={handleJoinRoom}>
                    <h2 className="text-center text-2xl text-white">
                        Введите ID комнаты, чтобы присоединиться
                    </h2>
                    <Input
                        label="Введите ID комнаты"
                        value={selectedRoom}
                        onValueChange={handleChangeRoomId}
                    />
                    <Input label="Ваше имя" value={currentName} onValueChange={handleNameChange} />
                    <Button type="submit">Присоединиться</Button>
                </form>
                <Divider className="my-2 h-0.5 w-full bg-gradient-to-r from-cyan-700 to-blue-700" />
                <p>или</p>
                <div className="flex w-full flex-col gap-5">
                    <h2 className="text-center text-xl text-white">
                        Выберите комнату, к которой присоединиться
                    </h2>
                    {gamingRooms?.length ? (
                        <div className="flex flex-col gap-2">
                            {gamingRooms.map((room) => (
                                <button
                                    type="button"
                                    key={room.id}
                                    className={cn(
                                        'flex w-full cursor-pointer items-center justify-between',
                                        'rounded-md from-cyan-700 to-blue-700 px-3 py-1 text-xl duration-100',
                                        'hover:bg-gradient-to-r hover:shadow-xl',
                                    )}
                                    onClick={() => handleCopyRoomId(room.id)}
                                >
                                    <p>{room.id.split('-')[0]}</p>
                                    <p>{room.playersLength}/2 игроков</p>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <p>Пока созданных комнат нет</p>
                    )}
                </div>
            </div>

            {leaderboard?.length && (
                <div
                    className={cn(
                        'flex min-h-1/2 w-4/5 flex-col items-center justify-center gap-5 lg:w-3/5 xl:w-1/2',
                        'rounded-md bg-gradient-to-r from-cyan-800 to-blue-900 px-5 py-6',
                    )}
                >
                    <h1 className="w-full text-start text-2xl">Прошедшие игры</h1>
                    {leaderboard.map((lb) => (
                        <div
                            key={lb.id}
                            className="flex w-full items-center justify-start gap-10 rounded-md px-3 py-1"
                        >
                            <h1>{lb.players.join(' vs. ')}</h1>
                            <h1 className="font-bold text-yellow-500">{lb.winnerName}</h1>
                            <h1>
                                {new Date(lb.createdAt).toLocaleString('ru-RU', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric',
                                })}{' '}
                                -{' '}
                                {new Date(lb.endedAt).toLocaleString('ru-RU', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric',
                                })}
                            </h1>
                            <h1>
                                20 - {lb.scores[lb.players.filter((p) => p === lb.winnerName)[0]]}
                            </h1>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
