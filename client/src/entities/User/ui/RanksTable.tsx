import { cn, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@heroui/react';

import { type Key, useCallback } from 'react';

import { getRanksStyles, RANK_THRESHOLDS } from '../model/lib/getRanksRatingMapper';
import { type UserRankKeys, userRankKeys, userRankMapper } from '../model/types/Ranks';

const columns = [
    { key: 'img', label: 'Картинка' },
    { key: 'title', label: 'Звание' },
    { key: 'threshold', label: 'Порог' },
];

export const userRankItems = userRankKeys.map((key) => ({ id: key }));

export const RanksTable = () => {
    const renderTableCell = useCallback((cell: UserRankKeys, key: Key) => {
        switch (key) {
            case 'img': {
                return (
                    <img
                        src={`/ranks/${cell}_rotated.webp`}
                        alt={userRankMapper[cell]}
                        className="ml-4 h-[30px] w-auto"
                    />
                );
            }
            case 'title': {
                return (
                    <p className={cn('col-span-2 font-medium', getRanksStyles(cell))}>
                        {userRankMapper[cell]}
                    </p>
                );
            }
            case 'threshold': {
                return (
                    <div className={cn('flex w-full justify-end font-bold', getRanksStyles(cell))}>
                        <p>{RANK_THRESHOLDS[cell]}</p>
                        <p>⚓</p>
                    </div>
                );
            }
        }
    }, []);

    return (
        <Table
            classNames={{
                th: 'bg-blue-800 text-white shadow-xl',
                table: 'text-white',
            }}
            removeWrapper
            aria-label="Game ranks"
            isHeaderSticky
        >
            <TableHeader columns={columns} className="bg-red-200">
                {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
            </TableHeader>
            <TableBody emptyContent="Почему-то не нашли табличку со званиями" items={userRankItems}>
                {(item) => (
                    <TableRow key={item.id}>
                        {(columnKey) => (
                            <TableCell>{renderTableCell(item.id, columnKey)}</TableCell>
                        )}
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
};
