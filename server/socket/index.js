const { authenticateSocket } = require('../middleware/auth');
const { Room, Gamelogs } = require('../models');
const setupRoomHandlers = require('./roomHandlers');
const setupGameHandlers = require('./gameHandlers');

const setupSocket = (io) => {
    // Middleware для аутентификации сокетов
    // io.use(authenticateSocket);

    io.on('connection', async (socket) => {
        console.log(`✅ \tNew client connected: ${socket.id} (User: ${socket.user?.username || 'Anonymous'})`);

        try {
            const [leaderboard, existingRooms] = await Promise.all([
                Gamelogs.find({}).lean(),
                Room.find({}).select('id players').lean()
            ]);

            if (leaderboard.length) {
                socket.emit('leaderboard', { games: leaderboard });
            }
            if (existingRooms.length) {
                socket.emit('existing-rooms', { rooms: existingRooms });
            }
        } catch (err) {
            console.error('Error on connection init:', err);
        }

        // Настройка обработчиков
        setupRoomHandlers(io, socket);
        setupGameHandlers(io, socket);

        socket.on('disconnect', async () => {
            console.log(`❌ \tClient disconnected: ${socket.id}`);
            const playerRoom = await Room.findOne({ playersUUID: socket.id });
            if (playerRoom && playerRoom?.id) {
                const leavedPlayerName = playerRoom.players[playerRoom.playersUUID.findIndex(id => id === socket.id)];
                socket.in(playerRoom.id).emit('leave-room', { player: leavedPlayerName });

                playerRoom.playersUUID = [...playerRoom.playersUUID].filter(p => p !== socket.id);
                playerRoom.players = [...playerRoom.players].filter(p => p !== leavedPlayerName);
                socket.leave(playerRoom.id);

                if (!playerRoom.playersUUID?.length && !playerRoom.players?.length) {
                    console.log('Удалил комнату - все ливнули');
                    await Room.deleteOne({ id: playerRoom?.id });
                    return;
                }

                playerRoom.lastActivity = new Date();
                playerRoom.markModified('playersUUID');
                playerRoom.markModified('players');
                await playerRoom.save();

                io.emit('existing-rooms', {
                    rooms: await Room.find({}).select('id players').lean(),
                });
            }
        });
    });
};

module.exports = setupSocket;

