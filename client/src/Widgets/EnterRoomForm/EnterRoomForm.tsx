import { Button, cn, Input } from '@heroui/react';

import { type FormEvent, useCallback, useState } from 'react';
import { useSelector } from 'react-redux';

import { GameboardActions, getCurrentPlayerName } from '@/entities/GameBoard';

import { useAppDispatch } from '@/shared/hooks/useAppDispatch';
import { getGameSocket } from '@/shared/hooks/useGameSocket';

export const EnterRoomForm = () => {
    const dispatch = useAppDispatch();

    const currentName = useSelector(getCurrentPlayerName);
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

    return (
        <div className="flex w-full flex-col items-center justify-center gap-5 px-4 py-8">
            <div
                className={cn(
                    'flex min-h-1/2 w-2/3 flex-col items-center justify-center',
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
            </div>
        </div>
    );
};
