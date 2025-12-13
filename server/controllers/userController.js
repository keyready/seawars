const User = require('../models/User');

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
            .select('-password -email')
            .sort({ rating: -1 })
            .limit(100)
            .lean();

        res.json({ leaderboard: users });
    } catch (error) {
        console.error('Ошибка получения таблицы лидеров:', error);
        res.status(500).json({ error: 'Ошибка при получении таблицы лидеров' });
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
                email: user.email,
                rank: user.rank,
                rating: user.rating,
                gamesPlayed: user.gamesPlayed,
                gamesWon: user.gamesWon,
            },
        });
    } catch (error) {
        console.error('Ошибка обновления профиля:', error);
        res.status(500).json({ error: 'Ошибка при обновлении профиля' });
    }
};

module.exports = {
    getUserProfile,
    getLeaderboard,
    updateProfile,
};

