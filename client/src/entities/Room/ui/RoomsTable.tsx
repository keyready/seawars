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

import { GameboardActions, getCurrentPlayerName, getGameRoom } from '@/entities/GameBoard';

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

    const { joinRoom } = useGameActions();

    const rooms = useSelector(getRooms);
    const isLoading = useSelector(getRoomsIsLoading);
    const username = useSelector(getCurrentPlayerName);
    const roomId = useSelector(getGameRoom);

    const [isModalOpened, setIsModalOpened] = useState<boolean>(false);

    useEffect(() => {
        dispatch(fetchRooms());
    }, [dispatch]);

    const handleConnectRoom = useCallback(() => {
        if (!username) {
            setIsModalOpened(true);
            return;
        }
        if (!roomId) {
            addToast({ color: 'danger', title: 'Не удалось определить комнату' });
            return;
        }
        console.log(roomId);
        joinRoom(roomId, username);
        navigate(`/battle/${roomId}`);
    }, [joinRoom, navigate, roomId, username]);

    const renderTableCell = useCallback(
        (cell: Room, key: Key) => {
            switch (key) {
                case 'host':
                    return <p className="w-full truncate">{cell.players[0]}</p>;
                case 'players':
                    return <p className="w-full">{cell.players.length} / 2</p>;
                default:
                    dispatch(GameboardActions.setGameRoom(cell.id));
                    return (
                        <Button
                            onPress={handleConnectRoom}
                            className="ml-auto"
                            size="sm"
                            color="primary"
                        >
                            Присоединиться
                        </Button>
                    );
            }
        },
        [dispatch, handleConnectRoom],
    );

    return (
        <>
            <Table
                classNames={{
                    th: 'bg-blue-800 tracking-[2px] text-white shadow-xl',
                }}
                removeWrapper
                aria-label="Last games"
            >
                <TableHeader columns={columns} className="bg-red-200">
                    {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
                </TableHeader>
                <TableBody isLoading={isLoading} emptyContent="Активных комнат нет" items={rooms}>
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
                <ModalContent>
                    <ModalHeader className="text-white">Вы не авторизовались</ModalHeader>
                    <ModalBody>
                        <Input
                            value={username}
                            onValueChange={(val) => dispatch(GameboardActions.setName(val))}
                            isRequired
                            label="Как вас зовут?"
                        />
                    </ModalBody>
                    <ModalFooter>
                        <Button onPress={handleConnectRoom}>Продолжить</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};
