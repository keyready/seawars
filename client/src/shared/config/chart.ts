import {
    ArcElement,
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    RadialLinearScale,
    Tooltip,
} from 'chart.js';

// Глобальная регистрация всех используемых типов графиков и шкал.
// Импортируй этот файл один раз (например, в StatisticsWrapper), чтобы
// избежать ошибок вида "category is not a registered scale" и проблем с Canvas.

ChartJS.register(
    CategoryScale,
    LinearScale,
    RadialLinearScale,
    BarElement,
    PointElement,
    LineElement,
    ArcElement,
    Tooltip,
    Legend,
);

export { ChartJS };


