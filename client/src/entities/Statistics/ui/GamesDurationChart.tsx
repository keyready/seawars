import { cn } from '@heroui/react';

import { Radar } from 'react-chartjs-2';

import type { GamesDuration } from '../model/types/Statistics';

interface GamesDurationChartProps {
    statistics: GamesDuration | undefined;
}

export const GamesDurationChart = ({ statistics }: GamesDurationChartProps) => {
    const labels = [
        'Игра в среднем',
        'Самая короткая',
        'Самая продолжительная',
        'Среднее время побед',
        'Среднее время поражений',
    ];

    const values = statistics
        ? [
              statistics.averageSeconds ?? 0,
              statistics.shortestSeconds ?? 0,
              statistics.longestSeconds ?? 0,
              statistics.averageWinSeconds ?? 0,
              statistics.averageLoseSeconds ?? 0,
          ]
        : [0, 0, 0, 0, 0];

    const data = {
        labels,
        datasets: [
            {
                label: 'Время, сек',
                data: values,
                borderColor: '#0ea5e9',
                backgroundColor: 'rgba(14, 165, 233, 0.25)',
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
            {statistics ? (
                <Radar data={data} options={{ plugins: { legend: { display: false } } }} />
            ) : (
                <p>Здесь будет статистика длительности Ваших игр</p>
            )}
        </div>
    );
};
