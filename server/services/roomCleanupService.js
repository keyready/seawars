const cron = require('node-cron');
const { Room } = require('../models');

const setupRoomCleanup = (io) => {
    cron.schedule('* * * * * *', async () => {
        try {
            const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);
            const inactiveRooms = await Room.find({
                lastActivity: { $lt: twoMinutesAgo }
            });

            if (inactiveRooms?.length > 0) {
                console.log(`🗑️  \tУдаление ${inactiveRooms?.length} неактивных комнат (неактивны более 2 минут)`);
                await Room.deleteMany({
                    lastActivity: { $lt: twoMinutesAgo }
                });

                io.emit('existing-rooms', {
                    rooms: await Room.find({}).select('id players').lean(),
                });
                io.emit('system', {
                    message: `Удаление ${inactiveRooms?.length} неактивных комнат (неактивны более 2 минут)`,
                });
            }
        } catch (err) {
            console.error('Ошибка при удалении неактивных комнат:', err);
        }
    });
};

module.exports = setupRoomCleanup;

