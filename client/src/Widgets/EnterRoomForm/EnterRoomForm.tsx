import { addToast, Button, cn, Divider, Input } from '@heroui/react';

import { type FormEvent, useCallback, useState } from 'react';
import { useSelector } from 'react-redux';

import {
    GameboardActions,
    getCurrentPlayerName,
    getGamingRooms,
    getLeaderboards,
} from '@/entities/GameBoard';

import { useAppDispatch } from '@/shared/hooks/useAppDispatch';
import { useGameActions } from '@/shared/hooks/useGameSocket';

export const EnterRoomForm = () => {
    const dispatch = useAppDispatch();
    const { createRoom, joinRoom } = useGameActions();

    const currentName = useSelector(getCurrentPlayerName);
    const gamingRooms = useSelector(getGamingRooms);
    const leaderboard = useSelector(getLeaderboards);

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

    const handleCopyRoomId = useCallback((id: string) => {
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(id);
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
        }
        setSelectedRoom(id);
        addToast({ color: 'success', title: 'ID комнаты скопирован' });
    }, []);

    const handleCreateRoom = useCallback(
        (ev: FormEvent<HTMLFormElement>) => {
            ev.preventDefault();
            createRoom(currentName);
        },
        [currentName, createRoom],
    );

    const handleJoinRoom = useCallback(
        (ev: FormEvent<HTMLFormElement>) => {
            ev.preventDefault();
            joinRoom(selectedRoom, currentName);
        },
        [currentName, selectedRoom, joinRoom],
    );

    return (
        <div className="flex w-full flex-col items-center justify-center gap-5 px-4 py-8">
            <div
                className={cn(
                    'min-h-1/2 flex w-4/5 flex-col items-center justify-center lg:w-3/5 xl:w-1/2',
                    'rounded-md bg-gradient-to-r from-cyan-800 to-blue-900 px-5 py-10',
                )}
            >
                <form
                    onSubmit={handleCreateRoom}
                    className="flex w-full items-center justify-center gap-2"
                >
                    <Input
                        isRequired
                        label="Ваше имя"
                        value={currentName}
                        onValueChange={handleNameChange}
                        minLength={5}
                        maxLength={15}
                    />
                    <Button isDisabled={!currentName} color="success" type="submit">
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
                        isRequired
                        label="Введите ID комнаты"
                        value={selectedRoom}
                        onValueChange={handleChangeRoomId}
                    />
                    <Button
                        isDisabled={!currentName || !selectedRoom}
                        color="primary"
                        type="submit"
                    >
                        Присоединиться
                    </Button>
                </form>
                <Divider className="my-2 h-0.5 w-full bg-gradient-to-r from-cyan-700 to-blue-700" />
                <p>или</p>
                <div className="flex w-full flex-col gap-5">
                    <h2 className="text-center text-xl text-white">
                        Выберите комнату, к которой присоединиться
                    </h2>
                    {gamingRooms?.length ? (
                        <div className="flex max-h-[100px] flex-col gap-2 overflow-y-auto">
                            {gamingRooms.map((room) => (
                                <button
                                    type="button"
                                    key={room.id}
                                    className={cn(
                                        'flex w-full cursor-pointer items-center justify-between',
                                        'rounded-md from-cyan-700 to-blue-700 px-3 py-1 text-xl duration-100',
                                        'text-sm hover:bg-gradient-to-r hover:shadow-xl',
                                    )}
                                    onClick={() => handleCopyRoomId(room.id)}
                                >
                                    <p>{room.id.split('-')[0]}</p>
                                    <p>{room.players.length}/2 игроков</p>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <p className="w-full text-center text-lg text-danger">
                            Пока созданных комнат нет
                        </p>
                    )}
                </div>
            </div>

            {leaderboard?.length && (
                <div
                    className={cn(
                        'flex h-1/2 w-4/5 flex-col items-center justify-center gap-2 lg:w-3/5 xl:w-1/2',
                        'rounded-md bg-gradient-to-r from-cyan-800 to-blue-900 px-5 py-6',
                    )}
                >
                    <h1 className="w-full text-start text-2xl">Прошедшие игры</h1>
                    <div className="w-full">
                        <div
                            className={cn(
                                'grid w-full grid-cols-12 items-center justify-start',
                                'gap-10 rounded-md px-3 py-1',
                            )}
                        >
                            <h1 className="col-span-3 truncate text-start font-bold">Кто играл</h1>
                            <h1 className="col-span-2 text-start font-bold">Победитель</h1>
                            <h1 className="col-span-4 truncate text-start font-bold">
                                Дата и время проведения
                            </h1>
                            <h1 className="col-span-3 truncate text-start font-bold">Счет игры</h1>
                        </div>
                        <Divider className="bg-gradient-to-r from-cyan-500 to-blue-600" />
                    </div>
                    <div className="max-h-[150px] w-full overflow-y-auto">
                        {leaderboard.map((lb) => (
                            <div
                                key={lb.id}
                                className={cn(
                                    'grid w-full grid-cols-12 items-center justify-start',
                                    'gap-10 rounded-md px-3 py-1',
                                )}
                            >
                                <h1 className="col-span-3 truncate text-start">
                                    {lb.players.join(' vs. ')}
                                </h1>
                                <h1 className="col-span-2 truncate text-start font-bold text-yellow-500">
                                    {lb.winnerName}
                                </h1>
                                <h1 className="col-span-4 truncate text-start">
                                    {new Date(lb.createdAt).toLocaleString('ru-RU', {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}{' '}
                                    -{' '}
                                    {new Date(lb.endedAt).toLocaleString('ru-RU', {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                    {', '}
                                    {new Date(lb.endedAt).toLocaleString('ru-RU', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric',
                                    })}
                                </h1>
                                <h1 className="col-span-3 truncate text-start">
                                    {lb.scores[lb.players.filter((p) => p !== lb.winnerName)[0]]} -{' '}
                                    {lb.scores[lb.players.filter((p) => p === lb.winnerName)[0]]}
                                </h1>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
