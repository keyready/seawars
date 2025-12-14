import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@heroui/react';

import { type Key, useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { useAppDispatch } from '@/shared/hooks/useAppDispatch';

import { getLeaderboards, getLeaderboardsIsLoading } from '../model/selectors/leaderboardSelectors';
import { fetchLeaderboards } from '../model/services/getLeaderboards';
import type { Leaderboard } from '../model/types/Leaderboard';

const columns = [
    { key: 'players', label: 'Кто играл' },
    { key: 'winner', label: 'Победитель' },
    { key: 'date', label: 'Дата и время проведения' },
    { key: 'score', label: 'Счет игры' },
];

export const LeaderboardTable = () => {
    const dispatch = useAppDispatch();

    const leaderboards = useSelector(getLeaderboards);
    const isLoading = useSelector(getLeaderboardsIsLoading);

    useEffect(() => {
        dispatch(fetchLeaderboards());
    }, [dispatch]);

    const renderTableCell = useCallback((cell: Leaderboard, key: Key) => {
        switch (key) {
            case 'players': {
                return <p className="tracking-[2px]">{cell.players.join(' vs. ')}</p>;
            }
            case 'winner': {
                return <p className="tracking-[2px] text-yellow-500">{cell.winnerName}</p>;
            }
            case 'date': {
                return (
                    <p className="tracking-[2px]">
                        {new Date(cell.createdAt).toLocaleString('ru-RU', {
                            hour: '2-digit',
                            minute: '2-digit',
                        })}{' '}
                        —{' '}
                        {new Date(cell.endedAt).toLocaleString('ru-RU', {
                            hour: '2-digit',
                            minute: '2-digit',
                        })}
                        {', '}
                        {new Date(cell.endedAt).toLocaleString('ru-RU', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                        })}
                    </p>
                );
            }
            default: {
                return (
                    <p>
                        {cell.scores[cell.players.filter((p) => p !== cell.winnerName)[0]]} —{' '}
                        {cell.scores[cell.players.filter((p) => p === cell.winnerName)[0]]}
                    </p>
                );
            }
        }
    }, []);

    return (
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
            <TableBody
                isLoading={isLoading}
                emptyContent="Игр пока нет или произошла ошибка загрузки"
                items={leaderboards}
            >
                {(item) => (
                    <TableRow key={item.id}>
                        {(columnKey) => <TableCell>{renderTableCell(item, columnKey)}</TableCell>}
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
};
