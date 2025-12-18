import { Checkbox, cn } from '@heroui/react';

import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';

import { NumberInput } from '@/shared/ui/NumberInput';

import type { Opponents } from '../model/types/Statistics';

interface OpponentsChartProps {
    statistics: Opponents[] | undefined;
}

export const OpponentsChart = ({ statistics }: OpponentsChartProps) => {
    const hasData = !!statistics && statistics.length > 0;

    const [sortedStatistics, setSortedStatistics] = useState<Opponents[]>([]);
    const [sortByWinrate, setSortByWinrate] = useState<boolean>(false);
    const [sliceRange, setSliceRange] = useState<number>(5);

    useEffect(() => {
        if (statistics) {
            if (sortByWinrate) {
                setSortedStatistics(
                    [...statistics].sort((a, b) => b.winrate - a.winrate).slice(0, sliceRange),
                );
            } else {
                setSortedStatistics(
                    [...statistics].sort((a, b) => b.games - a.games).slice(0, sliceRange),
                );
            }
        }
    }, [sliceRange, sortByWinrate, statistics]);

    if (!hasData) {
        return (
            <div
                className={cn(
                    'flex flex-col items-center justify-center',
                    'h-[450px] w-full rounded-xl bg-sky-200 p-3 text-black',
                )}
            >
                <p>Здесь будет статистика по соперникам</p>
            </div>
        );
    }

    const labels = sortedStatistics.map((item) => item.opponent);

    const data = {
        labels,
        datasets: [
            {
                label: 'Винрейт, %',
                data: sortedStatistics.map((item) => item.winrate),
                backgroundColor: 'rgba(59, 130, 246, 0.7)',
                borderColor: '#3b82f6',
                borderWidth: 1,
            },
            {
                label: 'Игр всего',
                data: sortedStatistics.map((item) => item.games),
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
                'h-[450px] w-full gap-5 rounded-xl bg-sky-200 p-3 text-black',
            )}
        >
            <Bar data={data} />
            <div className="flex w-full items-center gap-10">
                <Checkbox
                    onValueChange={setSortByWinrate}
                    isSelected={sortByWinrate}
                    className="w-full"
                    classNames={{ label: ' text-black' }}
                >
                    Сортировка по винрейту
                </Checkbox>
                <NumberInput
                    maxValue={statistics?.length}
                    minValue={0}
                    label="Показывать по"
                    value={sliceRange}
                    onValueChange={setSliceRange}
                />
            </div>
        </div>
    );
};
