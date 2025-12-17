import { cn } from '@heroui/react';
import { Line } from 'react-chartjs-2';

import type { UserCommonPoint } from '../model/types/Statistics';

interface LinechartProps {
    statistics: UserCommonPoint[] | undefined;
}

export const CommonStatisticsChart = ({ statistics }: LinechartProps) => {
    const labels = statistics?.map((item) =>
        new Date(item.date).toLocaleString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit',
        }),
    );

    const data = {
        labels,
        datasets: [
            {
                label: 'Игр за день',
                data: statistics?.map((item) => item.games),
                borderColor: '#c026d3',
                backgroundColor: 'rgba(192, 38, 211, 0.2)',
                tension: 0.2,
            },
            {
                label: 'Побед за день',
                data: statistics?.map((item) => item.wins),
                borderColor: '#059669',
                backgroundColor: 'rgba(5, 150, 105, 0.2)',
                tension: 0.2,
            },
            {
                label: 'Проигрышей за день',
                data: statistics?.map((item) => item.games - item.wins),
                borderColor: '#e11d48',
                backgroundColor: 'rgba(225, 29, 72, 0.2)',
                tension: 0.2,
            },
        ],
    };

    return (
        <div
            className={cn(
                'flex flex-col items-center justify-center',
                'h-[350px] w-full rounded-xl bg-sky-200 p-3 text-black',
            )}
        >
            {statistics?.length ? (
                <Line className="text-red-200" data={data} />
            ) : (
                <p>Здесь будет статистика Ваших игр</p>
            )}
        </div>
    );
};
