import { cn } from '@heroui/react';

import { Bar } from 'react-chartjs-2';

import type { Opponents } from '../model/types/Statistics';

interface OpponentsChartProps {
    statistics: Opponents[] | undefined;
}

export const OpponentsChart = ({ statistics }: OpponentsChartProps) => {
    const hasData = !!statistics && statistics.length > 0;

    if (!hasData) {
        return (
            <div
                className={cn(
                    'flex flex-col items-center justify-center',
                    'h-[350px] w-full rounded-xl bg-sky-200 p-3 text-black',
                )}
            >
                <p>Здесь будет статистика по соперникам</p>
            </div>
        );
    }

    const labels = statistics.map((item) => item.opponent);

    const data = {
        labels,
        datasets: [
            {
                label: 'Винрейт, %',
                data: statistics.map((item) => item.winrate),
                backgroundColor: 'rgba(59, 130, 246, 0.7)',
                borderColor: '#3b82f6',
                borderWidth: 1,
            },
            {
                label: 'Игр всего',
                data: statistics.map((item) => item.games),
                backgroundColor: 'rgba(16, 185, 129, 0.6)',
                borderColor: '#10b981',
                borderWidth: 1,
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
            <Bar data={data} />
        </div>
    );
};
