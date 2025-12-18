const { Room, ChatMessage } = require('../models');

const setupChatHandlers = (io, socket) => {
    // Отправка сообщения в комнату
    socket.on('send-message', async ({ roomId, message, player }) => {
        try {
            // Проверяем, что комната существует
            const room = await Room.findOne({ id: roomId });
            if (!room) {
                return socket.emit('error', { message: `Room ${roomId} not found` });
            }

            // Проверяем, что игрок в комнате
            const playerName = socket.user?.username || player;
            if (!room.players.includes(playerName)) {
                return socket.emit('error', { message: 'You are not in this room' });
            }

            // Создаем сообщение
            const chatMessage = new ChatMessage({
                roomId,
                sender: playerName,
                text: message.trim(),
                createdAt: new Date()
            });

            await chatMessage.save();

            // Отправляем сообщение всем в комнате
            io.in(roomId).emit('new-message', {
                sender: playerName,
                text: message.trim(),
                createdAt: chatMessage.createdAt
            });

            // Обновляем активность комнаты
            room.lastActivity = new Date();
            await room.save();

        } catch (err) {
            console.error('Error sending message:', err);
            socket.emit('error', { message: 'Failed to send message' });
        }
    });

    // Получение истории сообщений при входе в комнату
    socket.on('get-chat-history', async ({ roomId, player }) => {
        try {
            const room = await Room.findOne({ id: roomId });
            if (!room) {
                return socket.emit('error', { message: `Room ${roomId} not found` });
            }

            const playerName = socket.user?.username || player;
            if (!room.players.includes(playerName)) {
                return socket.emit('error', { message: 'You are not in this room' });
            }

            // Получаем последние 50 сообщений комнаты
            const messages = await ChatMessage.find({ roomId })
                .sort({ createdAt: -1 })
                .limit(50)
                .select('sender text createdAt')
                .lean();

            // Отправляем историю в обратном порядке (старые -> новые)
            socket.emit('chat-history', messages.reverse());

        } catch (err) {
            console.error('Error getting chat history:', err);
            socket.emit('error', { message: 'Failed to get chat history' });
        }
    });
};

module.exports = setupChatHandlers;
