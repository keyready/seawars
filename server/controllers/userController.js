const User = require('../models/User');
const { Gamelogs, Room } = require('../models');
const { verifyToken } = require('../utils/jwt');

const getUserProfile = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId).select('-password');

        if (!user) {
            return res.status(404).json({ error: 'Пользователь не найден' });
        }

        res.json({
            user: {
                id: user._id,
                username: user.username,
                rank: user.rank,
                rating: user.rating,
                gamesPlayed: user.gamesPlayed,
                gamesWon: user.gamesWon,
                lastGameDate: user.lastGameDate,
                lastOnlineDate: user.lastOnlineDate,
                winStreak: user.winStreak,
                bestWinStreak: user.bestWinStreak,
            },
        });
    } catch (error) {
        console.error('Ошибка получения профиля:', error);
        res.status(500).json({ error: 'Ошибка при получении профиля' });
    }
};

const getLeaderboard = async (req, res) => {
    try {
        const users = await User.find({})
            .select('-password')
            .sort({ rating: -1 })
            .limit(100)
            .lean();

        res.json(users);
    } catch (error) {
        console.error('Ошибка получения таблицы лидеров:', error);
        res.status(500).json({ error: 'Ошибка при получении таблицы лидеров' });
    }
};

const getGames = async (req, res) => {
    try {
        const games = await Gamelogs.find({}).lean();
        res.json(games);
    } catch (error) {
        console.error('Ошибка получения игр:', error);
        res.status(500).json({ error: 'Ошибка при получении игр' });
    }
};

const getRooms = async (req, res) => {
    try {
        const rooms = await Room.find({}).select('id players').lean();
        res.json(rooms);
    } catch (error) {
        console.error('Ошибка получения комнат:', error);
        res.status(500).json({ error: 'Ошибка при получении комнат' });
    }
};

const updateProfile = async (req, res) => {
    try {
        const { username } = req.body;
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ error: 'Пользователь не найден' });
        }

        if (username && username !== user.username) {
            // Проверка уникальности имени
            const existingUser = await User.findOne({ username });
            if (existingUser) {
                return res.status(400).json({ error: 'Пользователь с таким именем уже существует' });
            }
            user.username = username;
        }

        await user.save();

        res.json({
            message: 'Профиль обновлен',
            user: {
                id: user._id,
                username: user.username,
                rank: user.rank,
                rating: user.rating,
                gamesPlayed: user.gamesPlayed,
                gamesWon: user.gamesWon,
                winStreak: user.winStreak,
                bestWinStreak: user.bestWinStreak,
            },
        });
    } catch (error) {
        console.error('Ошибка обновления профиля:', error);
        res.status(500).json({ error: 'Ошибка при обновлении профиля' });
    }
};

const getUserStatistics = async (req, res) => {
    try {
        const token =
            req.headers.authorization?.split('Bearer ')[1] || req.query.token;

        if (!token) {
            return res.status(401).json({ error: 'Токен не предоставлен' });
        }

        const decoded = verifyToken(token);

        if (!decoded || !decoded.userId) {
            return res.status(401).json({ error: 'Недействительный токен' });
        }

        const user = await User.findById(decoded.userId).select('username');

        if (!user) {
            return res.status(404).json({ error: 'Пользователь не найден' });
        }

        const username = user.username;

        const games = await Gamelogs.find({ players: username })
            .sort({ createdAt: 1 })
            .lean();

        if (!games.length) {
            return res.json({
                username,
                statistics: [],
                summary: { totalGames: 0, totalWins: 0 },
                matchups: [],
                durations: null,
                scores: null,
                streaks: {
                    currentWinStreak: 0,
                    maxWinStreak: 0,
                    currentLoseStreak: 0,
                    maxLoseStreak: 0,
                },
            });
        }

        // ----------------------------
        // Статистика по датам (как раньше)
        // ----------------------------
        const statsByDateMap = new Map();

        // ----------------------------
        // Матчапы по соперникам
        // ----------------------------
        const matchupsMap = new Map();

        // ----------------------------
        // Длительность матчей
        // ----------------------------
        let durationsCount = 0;
        let totalDurationMs = 0;
        let shortestDurationMs = null;
        let longestDurationMs = null;

        let winDurationsCount = 0;
        let totalWinDurationMs = 0;

        let loseDurationsCount = 0;
        let totalLoseDurationMs = 0;

        // ----------------------------
        // Статистика по scores
        // ----------------------------
        let totalSelfScore = 0;
        let totalOppScore = 0;
        let maxSelfScore = null;
        let minSelfScore = null;
        let totalScoreDiff = 0;

        // ----------------------------
        // Серии побед и поражений
        // ----------------------------
        let currentWinStreak = 0;
        let maxWinStreak = 0;
        let currentLoseStreak = 0;
        let maxLoseStreak = 0;

        let totalGames = 0;
        let totalWins = 0;

        for (const game of games) {
            const createdAt = game.createdAt ? new Date(game.createdAt) : null;
            const endedAt = game.endedAt
                ? new Date(game.endedAt)
                : createdAt;
            const gameDate = endedAt || createdAt || null;

            const dateKey = gameDate
                ? gameDate.toISOString().slice(0, 10)
                : 'unknown';

            const isWin = game.winnerName === username;
            const isLoss =
                !!game.winnerName && game.winnerName !== username;

            totalGames += 1;
            if (isWin) {
                totalWins += 1;
            }

            // --- по датам ---
            const dateStats =
                statsByDateMap.get(dateKey) || {
                    date: dateKey,
                    games: 0,
                    wins: 0,
                };
            dateStats.games += 1;
            if (isWin) {
                dateStats.wins += 1;
            }
            statsByDateMap.set(dateKey, dateStats);

            // --- матчапы ---
            const opponents = Array.isArray(game.players)
                ? game.players.filter((p) => p !== username)
                : [];
            const opponent = opponents[0] || 'unknown';

            const matchup =
                matchupsMap.get(opponent) || {
                    opponent,
                    games: 0,
                    wins: 0,
                    losses: 0,
                    lastGameDate: null,
                };

            matchup.games += 1;
            if (isWin) {
                matchup.wins += 1;
            } else if (isLoss) {
                matchup.losses += 1;
            }
            if (gameDate) {
                if (
                    !matchup.lastGameDate ||
                    gameDate > matchup.lastGameDate
                ) {
                    matchup.lastGameDate = gameDate;
                }
            }

            matchupsMap.set(opponent, matchup);

            // --- длительность матчей ---
            if (createdAt && endedAt) {
                const durationMs = endedAt.getTime() - createdAt.getTime();

                if (durationMs >= 0) {
                    durationsCount += 1;
                    totalDurationMs += durationMs;

                    if (
                        shortestDurationMs === null ||
                        durationMs < shortestDurationMs
                    ) {
                        shortestDurationMs = durationMs;
                    }
                    if (
                        longestDurationMs === null ||
                        durationMs > longestDurationMs
                    ) {
                        longestDurationMs = durationMs;
                    }

                    if (isWin) {
                        winDurationsCount += 1;
                        totalWinDurationMs += durationMs;
                    } else if (isLoss) {
                        loseDurationsCount += 1;
                        totalLoseDurationMs += durationMs;
                    }
                }
            }

            // --- scores ---
            const scores = game.scores || {};
            const selfScore =
                typeof scores[username] === 'number'
                    ? scores[username]
                    : 0;

            let opponentScore = 0;
            if (opponent && typeof scores[opponent] === 'number') {
                opponentScore = scores[opponent];
            }

            totalSelfScore += selfScore;
            totalOppScore += opponentScore;

            if (maxSelfScore === null || selfScore > maxSelfScore) {
                maxSelfScore = selfScore;
            }
            if (minSelfScore === null || selfScore < minSelfScore) {
                minSelfScore = selfScore;
            }

            totalScoreDiff += selfScore - opponentScore;

            // --- серии побед и поражений ---
            if (isWin) {
                currentWinStreak += 1;
                if (currentWinStreak > maxWinStreak) {
                    maxWinStreak = currentWinStreak;
                }
                currentLoseStreak = 0;
            } else if (isLoss) {
                currentLoseStreak += 1;
                if (currentLoseStreak > maxLoseStreak) {
                    maxLoseStreak = currentLoseStreak;
                }
                currentWinStreak = 0;
            } else {
                // ничья или странный статус — обнуляем обе серии
                currentWinStreak = 0;
                currentLoseStreak = 0;
            }
        }

        const statistics = Array.from(statsByDateMap.values()).sort((a, b) =>
            a.date.localeCompare(b.date),
        );

        const summary = {
            totalGames,
            totalWins,
        };

        const matchups = Array.from(matchupsMap.values())
            .map((m) => ({
                opponent: m.opponent,
                games: m.games,
                wins: m.wins,
                losses: m.losses,
                winrate:
                    m.games > 0
                        ? Math.round((m.wins / m.games) * 10000) / 100
                        : 0,
                lastGameDate: m.lastGameDate,
            }))
            .sort((a, b) => b.games - a.games);

        const durations =
            durationsCount > 0
                ? {
                      averageSeconds: Math.round(
                          totalDurationMs / durationsCount / 1000,
                      ),
                      shortestSeconds:
                          shortestDurationMs !== null
                              ? Math.round(shortestDurationMs / 1000)
                              : null,
                      longestSeconds:
                          longestDurationMs !== null
                              ? Math.round(longestDurationMs / 1000)
                              : null,
                      averageWinSeconds:
                          winDurationsCount > 0
                              ? Math.round(
                                    totalWinDurationMs /
                                        winDurationsCount /
                                        1000,
                                )
                              : null,
                      averageLoseSeconds:
                          loseDurationsCount > 0
                              ? Math.round(
                                    totalLoseDurationMs /
                                        loseDurationsCount /
                                        1000,
                                )
                              : null,
                  }
                : null;

        const scoresStats =
            totalGames > 0
                ? {
                      averageCellsKilled:
                          totalSelfScore / totalGames,
                      averageCellsLost: totalOppScore / totalGames,
                      maxCellsKilled: maxSelfScore,
                      minCellsKilled: minSelfScore,
                      averageCellDiff:
                          totalScoreDiff / totalGames,
                  }
                : null;

        const streaks = {
            currentWinStreak,
            maxWinStreak,
            currentLoseStreak,
            maxLoseStreak,
        };

        res.json({
            username,
            statistics,
            summary,
            matchups,
            durations,
            scores: scoresStats,
            streaks,
        });
    } catch (error) {
        console.error('Ошибка получения статистики пользователя:', error);
        res.status(500).json({ error: 'Ошибка при получении статистики пользователя' });
    }
};

module.exports = {
    getUserProfile,
    getLeaderboard,
    getGames,
    getRooms,
    updateProfile,
    getUserStatistics,
};

