import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@heroui/react';

import { type Key, useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { useAppDispatch } from '@/shared/hooks/useAppDispatch';
import { Card } from '@/shared/ui/Card';

import { getUsersLeaderboard } from '../model/selectors/userSelectors';
import { getUsersLeaderboard as getUsersLeaderboardService } from '../model/services/getUsersLeaderboard';
import { userRankMapper } from '../model/types/Ranks';
import type { User } from '../model/types/User';

const columns = [
    { key: 'username', label: 'Логин' },
    { key: 'rating', label: 'Рейтинг' },
    { key: 'rank', label: 'Ранг' },
    { key: 'gamesPlayed', label: 'Игр сыграно' },
    { key: 'gamesWon', label: 'Игр выиграно' },
];

export const LeaderboardBlock = () => {
    const leaderboard = useSelector(getUsersLeaderboard);

    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(getUsersLeaderboardService());
    }, [dispatch]);

    const renderTableCell = useCallback((cell: User, key: Key) => {
        switch (key) {
            // username rating rank gamesPlayed gamesWon
            case 'username': {
                return <p>{cell.username}</p>;
            }
            case 'rating': {
                return <p>{cell.rating}</p>;
            }
            case 'rank': {
                return <p>{userRankMapper[cell.rank]}</p>;
            }
            case 'gamesPlayed': {
                return <p>{cell.gamesPlayed}</p>;
            }
            case 'gamesWon': {
                return <p>{cell.gamesWon}</p>;
            }
        }
    }, []);

    return (
        <Card title="Топ игроков">
            <Table
                classNames={{
                    th: 'bg-blue-800 text-white shadow-xl',
                }}
                removeWrapper
                aria-label="Top players"
            >
                <TableHeader columns={columns} className="bg-red-200">
                    {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
                </TableHeader>
                <TableBody
                    emptyContent="Игроков пока нет или произошла ошибка"
                    items={leaderboard || []}
                >
                    {(item) => (
                        <TableRow key={item.username}>
                            {(columnKey) => (
                                <TableCell>{renderTableCell(item, columnKey)}</TableCell>
                            )}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </Card>
    );
};
