const User = require('../models/User');
const { generateToken } = require('../utils/jwt');

const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Валидация
        if (!username || !email || !password) {
            return res.status(400).json({ error: 'Все поля обязательны' });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: 'Пароль должен быть не менее 6 символов' });
        }

        // Проверка существования пользователя
        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        });

        if (existingUser) {
            return res.status(400).json({ error: 'Пользователь с таким email или именем уже существует' });
        }

        // Создание пользователя
        const user = new User({
            username,
            email,
            password,
        });

        await user.save();

        // Генерация токена
        const token = generateToken(user._id);

        res.status(201).json({
            message: 'Пользователь успешно зарегистрирован',
            token,
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
        console.error('Ошибка регистрации:', error);
        res.status(500).json({ error: 'Ошибка при регистрации пользователя' });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email и пароль обязательны' });
        }

        // Поиск пользователя
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Неверный email или пароль' });
        }

        // Проверка пароля
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Неверный email или пароль' });
        }

        // Обновление даты последнего онлайна
        user.lastOnlineDate = new Date();
        await user.save();

        // Генерация токена
        const token = generateToken(user._id);

        res.json({
            message: 'Успешный вход',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                rank: user.rank,
                rating: user.rating,
                gamesPlayed: user.gamesPlayed,
                gamesWon: user.gamesWon,
                lastGameDate: user.lastGameDate,
                lastOnlineDate: user.lastOnlineDate,
            },
        });
    } catch (error) {
        console.error('Ошибка входа:', error);
        res.status(500).json({ error: 'Ошибка при входе' });
    }
};

const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        res.json({
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                rank: user.rank,
                rating: user.rating,
                gamesPlayed: user.gamesPlayed,
                gamesWon: user.gamesWon,
                lastGameDate: user.lastGameDate,
                lastOnlineDate: user.lastOnlineDate,
            },
        });
    } catch (error) {
        console.error('Ошибка получения данных пользователя:', error);
        res.status(500).json({ error: 'Ошибка при получении данных пользователя' });
    }
};

module.exports = {
    register,
    login,
    getMe,
};

