import { cn } from '@heroui/react';

import { Bar } from 'react-chartjs-2';

import type { Streaks } from '../model/types/Statistics';

interface StreaksChartProps {
    statistics: Streaks | undefined;
}

export const StreaksChart = ({ statistics }: StreaksChartProps) => {
    const labels = [
        'Текущая серия побед',
        'Макс. серия побед',
        'Текущая серия поражений',
        'Макс. серия поражений',
    ];

    const values = statistics
        ? [
              statistics.currentWinStreak ?? 0,
              statistics.maxWinStreak ?? 0,
              statistics.currentLoseStreak ?? 0,
              statistics.maxLoseStreak ?? 0,
          ]
        : [0, 0, 0, 0];

    const data = {
        labels,
        datasets: [
            {
                label: 'Количество игр подряд',
                data: values,
                backgroundColor: 'rgba(37, 99, 235, 0.7)',
                borderColor: '#2563eb',
                borderWidth: 1,
            },
        ],
    };

    const hasData = statistics != null;

    return (
        <div
            className={cn(
                'flex flex-col items-center justify-center',
                'h-[450px] w-full rounded-xl bg-sky-200 p-3 text-black',
            )}
        >
            {hasData ? <Bar data={data} /> : <p>Здесь будет статистика серий побед и поражений</p>}
        </div>
    );
};
