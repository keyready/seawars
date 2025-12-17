import { userRankKeys, type UserRankKeys } from '../types/Ranks';

const thresholds: number[] = [];

const lowSteps = [300, 200, 200, 200, 200, 200];
let current = 0;
thresholds.push(current);
for (const step of lowSteps) {
    current += step;
    thresholds.push(current);
}

const midSteps = [200, 200, 200, 200, 200, 200];
for (const step of midSteps) {
    current += step;
    thresholds.push(current);
}

const highSteps = [200, 200, 200, 200, 300, 300];
for (let i = 0; i < highSteps.length; i++) {
    current += highSteps[i];

    if (i === highSteps.length - 1) {
        current = 3800;
    }
    thresholds.push(current);
}

if (thresholds.length !== userRankKeys.length) {
    throw new Error('Rank thresholds mismatch');
}
for (let i = 1; i < thresholds.length; i++) {
    if (thresholds[i] <= thresholds[i - 1]) {
        throw new Error(`Non-increasing threshold at index ${i}`);
    }
}

export const RANK_THRESHOLDS = Object.fromEntries(
    userRankKeys.map((key, i) => [key, thresholds[i]]),
) as Record<UserRankKeys, number>;

export function getRankByRating(rating: number): UserRankKeys {
    for (let i = userRankKeys.length - 1; i >= 0; i--) {
        const key = userRankKeys[i];
        if (rating >= RANK_THRESHOLDS[key]) {
            return key;
        }
    }
    return 'sailor';
}

export const getRanksStyles = (rank: UserRankKeys) => {
    if (RANK_THRESHOLDS[rank] >= 3100) {
        return 'text-yellow-500';
    }
    if (RANK_THRESHOLDS[rank] >= 2500) {
        return 'text-rose-400';
    }
    if (RANK_THRESHOLDS[rank] > 1500) {
        return 'text-fuchsia-800';
    }
    if (RANK_THRESHOLDS[rank] > 1000) {
        return 'text-indigo-300';
    }
    return 'text-gray-300';
};
