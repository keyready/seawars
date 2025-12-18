import { useEffect } from 'react';
import { useSelector } from 'react-redux';

import '@/shared/config/chart';
import { useAppDispatch } from '@/shared/hooks/useAppDispatch';
import { Carousel } from '@/shared/ui/Carousel';

import {
    getCommonStatistics,
    getGamesDurationStatistics,
    getGamesProgressStatistics,
    getOpponentsStatistics,
    getStreaksStatistics,
} from '../model/selectors/getStatistics';
import { getStatistics } from '../model/services/getStatistics';

import { CommonStatisticsChart } from './CommonStatisticsChart';
import { GamesDurationChart } from './GamesDurationChart';
import { GamesProgressChart } from './GamesProgressChart';
import { OpponentsChart } from './OpponentsChart';
import { StreaksChart } from './StreaksChart';

export const StatisticsWrapper = () => {
    const common = useSelector(getCommonStatistics);
    const gamesProgress = useSelector(getGamesProgressStatistics);
    const opponents = useSelector(getOpponentsStatistics);
    const duration = useSelector(getGamesDurationStatistics);
    const streaks = useSelector(getStreaksStatistics);

    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(getStatistics());
    }, [dispatch]);

    return (
        <Carousel
            slides={[
                <CommonStatisticsChart key="common-stat" statistics={common} />,
                <GamesDurationChart key="duration-stat" statistics={duration} />,
                <GamesProgressChart key="progress-stat" statistics={gamesProgress} />,
                <OpponentsChart key="opponent-stat" statistics={opponents} />,
                <StreaksChart key="streaks-stat" statistics={streaks} />,
            ]}
        />
    );
};
