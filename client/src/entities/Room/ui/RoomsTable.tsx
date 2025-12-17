import {
    addToast,
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
} from '@heroui/react';

import { type Key, useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

import { getUserData, UserActions } from '@/entities/User';

import { useAppDispatch } from '@/shared/hooks/useAppDispatch';
import { useGameActions } from '@/shared/hooks/useGameSocket';
import { Input } from '@/shared/ui/Input';

import { getRooms, getRoomsIsLoading } from '../model/selectors/roomSelectors';
import { fetchRooms } from '../model/services/fetchRooms';
import type { Room } from '../model/types/Room';

const columns = [
    { key: 'host', label: 'Создатель' },
    { key: 'players', label: 'Игроки' },
    { key: 'actions', label: '' },
];

export const RoomsTable = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const { joinRoom, createRoom } = useGameActions();

    const rooms = useSelector(getRooms);
    const isLoading = useSelector(getRoomsIsLoading);
    const username = useSelector(getUserData)?.username;

    const [isModalOpened, setIsModalOpened] = useState<boolean>(false);
    const [isAnonymousPlayer, setIsAnonymousPlayer] = useState<boolean>(false);
    const [localRoom, setLocalRoom] = useState<string>('');

    useEffect(() => {
        dispatch(fetchRooms());
    }, [dispatch]);

    const handleCreateRoom = useCallback(() => {
        if (!username) {
            setIsModalOpened(true);
            setIsAnonymousPlayer(true);
            return;
        }
        createRoom(username);
    }, [username, createRoom]);

    const handleConnectRoom = useCallback(
        (roomId: string) => {
            if (!username) {
                setIsModalOpened(true);
                return;
            }
            if (isAnonymousPlayer) {
                handleCreateRoom();
                return;
            }
            if (!roomId) {
                addToast({ color: 'danger', title: 'Не удалось определить комнату' });
                return;
            }
            setLocalRoom(roomId);
            joinRoom(roomId, username);
            navigate(`/battle/${roomId}`);
        },
        [handleCreateRoom, isAnonymousPlayer, joinRoom, navigate, username],
    );

    const renderTableCell = useCallback(
        (cell: Room, key: Key) => {
            switch (key) {
                case 'host':
                    return <p className="w-full truncate">{cell.players[0]}</p>;
                case 'players':
                    return <p className="w-full">{cell.players.length} / 2</p>;
                default:
                    return (
                        <Button
                            onPress={() => handleConnectRoom(cell.id)}
                            className="ml-auto"
                            size="sm"
                            color="primary"
                        >
                            Присоединиться
                        </Button>
                    );
            }
        },
        [handleConnectRoom],
    );

    return (
        <div className="relative w-full">
            <Button
                onPress={handleCreateRoom}
                color="success"
                size="sm"
                className="absolute -top-9 right-0 z-50"
            >
                Создать комнату
            </Button>
            <Table
                classNames={{
                    th: 'bg-blue-800 text-white shadow-xl',
                }}
                removeWrapper
                aria-label="Last games"
            >
                <TableHeader columns={columns} className="bg-red-200">
                    {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
                </TableHeader>
                <TableBody
                    isLoading={isLoading}
                    emptyContent="Активных комнат нет"
                    items={rooms || []}
                >
                    {(item) => (
                        <TableRow key={item.id}>
                            {(columnKey) => (
                                <TableCell>{renderTableCell(item, columnKey)}</TableCell>
                            )}
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            <Modal size="2xl" isOpen={isModalOpened} onClose={() => setIsModalOpened(false)}>
                <ModalContent className="bg-gradient-to-br from-gradStart to-gradEnd">
                    <ModalHeader className="text-white">Вы не авторизовались</ModalHeader>
                    <ModalBody>
                        <Input
                            value={username}
                            onValueChange={(val) => dispatch(UserActions.setTemporaryName(val))}
                            isRequired
                            label="Как вас зовут?"
                        />
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onPress={() => handleConnectRoom(localRoom)}>
                            Продолжить
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    );
};
