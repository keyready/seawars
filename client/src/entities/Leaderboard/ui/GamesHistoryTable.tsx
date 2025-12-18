import {
    Pagination,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
} from '@heroui/react';

import { type Key, useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { useAppDispatch } from '@/shared/hooks/useAppDispatch';

import {
    getGames,
    getGamesIsLoading,
    getTotalGames,
} from '../model/selectors/leaderboardSelectors';
import { fetchLeaderboards } from '../model/services/getLeaderboards';
import type { Leaderboard } from '../model/types/Leaderboard';

const columns = [
    { key: 'players', label: 'Кто играл' },
    { key: 'winner', label: 'Победитель' },
    { key: 'date', label: 'Дата и время проведения' },
    { key: 'score', label: 'Счет игры' },
];

export const GamesHistoryTable = () => {
    const dispatch = useAppDispatch();

    const leaderboards = useSelector(getGames);
    const totalGames = useSelector(getTotalGames);
    const isLoading = useSelector(getGamesIsLoading);

    const [page, setPage] = useState<number>(1);

    useEffect(() => {
        dispatch(fetchLeaderboards(page));
    }, [dispatch, page]);

    const renderTableCell = useCallback((cell: Leaderboard, key: Key) => {
        switch (key) {
            case 'players': {
                return <p className="max-w-[150px] truncate">{cell.players.join(' vs. ')}</p>;
            }
            case 'winner': {
                return <p className="text-yellow-500">{cell.winnerName}</p>;
            }
            case 'date': {
                return (
                    <p>
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
                th: 'bg-blue-800 text-white shadow-xl',
            }}
            removeWrapper
            aria-label="Last games"
            bottomContent={
                <div className="flex w-full justify-center">
                    <Pagination
                        isCompact
                        showControls
                        showShadow
                        color="primary"
                        variant="light"
                        page={page}
                        total={Math.round(totalGames / 10) || 1}
                        onChange={(page) => setPage(page)}
                    />
                </div>
            }
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
