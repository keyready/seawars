const { verifyToken } = require('../utils/jwt');
const User = require('../models/User');

const authenticate = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split('Bearer ')[1] || req.query.token;

        if (!token) {
            return res.status(401).json({ error: 'Токен не предоставлен' });
        }

        const decoded = verifyToken(token);
        if (!decoded) {
            return res.status(401).json({ error: 'Недействительный токен' });
        }

        const user = await User.findById(decoded.userId).select('-password');
        if (!user) {
            return res.status(401).json({ error: 'Пользователь не найден' });
        }

        // Обновляем дату последнего онлайна
        user.lastOnlineDate = new Date();
        await user.save();

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Ошибка аутентификации' });
    }
};

const authenticateSocket = async (socket, next) => {
    try {
        const token = socket.handshake.auth?.token || socket.handshake.query?.token;

        // Если токен не предоставлен, разрешаем подключение без пользователя
        if (!token) {
            socket.user = null;
            return next();
        }

        const decoded = verifyToken(token);
        if (!decoded) {
            // Если токен недействителен, разрешаем подключение без пользователя
            socket.user = null;
            return next();
        }

        const user = await User.findById(decoded.userId).select('-password');
        if (!user) {
            socket.user = null;
            return next();
        }

        // Обновляем дату последнего онлайна
        user.lastOnlineDate = new Date();
        await user.save();

        socket.user = user;
        next();
    } catch (error) {
        // В случае ошибки разрешаем подключение без пользователя
        socket.user = null;
        next();
    }
};

module.exports = {
    authenticate,
    authenticateSocket,
};

