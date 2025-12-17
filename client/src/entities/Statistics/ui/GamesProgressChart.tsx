import { cn } from '@heroui/react';
import { Bar } from 'react-chartjs-2';

import type { GameProgress } from '../model/types/Statistics';

interface GamesProgressChartProps {
    statistics: GameProgress | undefined;
}

export const GamesProgressChart = ({ statistics }: GamesProgressChartProps) => {
    const labels = [
        'Среднее подбитых',
        'Среднее потерянных',
        'Макс. подбитых',
        'Мин. подбитых',
        'Средняя разница',
    ];

    const values = statistics
        ? [
              statistics.averageCellsKilled ?? 0,
              statistics.averageCellsLost ?? 0,
              statistics.maxCellsKilled ?? 0,
              statistics.minCellsKilled ?? 0,
              statistics.averageCellDiff ?? 0,
          ]
        : [0, 0, 0, 0, 0];

    const data = {
        labels,
        datasets: [
            {
                label: 'Клетки',
                data: values,
                backgroundColor: 'rgba(249, 115, 22, 0.7)',
                borderColor: '#f97316',
                borderWidth: 1,
            },
        ],
    };

    const hasData = statistics != null;

    return (
        <div
            className={cn(
                'flex flex-col items-center justify-center',
                'h-[350px] w-full rounded-xl bg-sky-200 p-3 text-black',
            )}
        >
            {hasData ? <Bar data={data} /> : <p>Здесь будет статистика боёв по клеткам</p>}
        </div>
    );
};


