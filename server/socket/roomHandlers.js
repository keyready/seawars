const { v4: uuidv4 } = require('uuid');
const { Room } = require('../models');

const setupRoomHandlers = (io, socket) => {
    socket.on('create-room', async ({ name }) => {
        const roomId = uuidv4();
        const playerName = socket.user?.username || name;

        try {
            const newRoom = new Room({
                id: roomId,
                fleets: {},
                turn: 'waiting',
                started: false,
                players: [playerName],
                playersUUID: [socket.id],
                createdAt: new Date(),
                lastActivity: new Date(),
            });

            await newRoom.save();

            socket.join(roomId);

            io.in(roomId).emit('room-created', { roomId });
            io.emit('existing-rooms', {
                rooms: await Room.find({}).select('id players').lean(),
            });
        } catch (err) {
            console.error('Error creating room:', err);
            socket.emit('error', { message: 'Failed to create room' });
        }
    });

    socket.on('join-room', async ({ roomId, name }) => {
        try {
            const room = await Room.findOne({ id: roomId });
            if (!room) return socket.emit('error', { message: `Room ${roomId} not found` });
            if (room.players.length >= 2) return socket.emit('error', { message: 'Room is full' });

            const playerName = socket.user?.username || name;
            room.players.push(playerName);
            room.playersUUID.push(socket.id);
            room.lastActivity = new Date();
            await room.save();

            socket.join(roomId);
            socket.emit('joined-room', { roomId, player: playerName });
            socket.to(roomId).emit('player-joined', { player: playerName });

            io.emit('existing-rooms', {
                rooms: await Room.find({}).select('id players').lean(),
            });
        } catch (err) {
            console.error('Error joining room:', err);
            socket.emit('error', { message: 'Failed to join room' });
        }
    });

    socket.on('get-room-info', async ({ roomId, name }) => {
        try {
            const room = await Room.findOne({ id: roomId });
            if (!room) return socket.emit('error', { message: 'Room not found' });

            const playerName = socket.user?.username || name;
            if (!room.players.includes(playerName)) {
                return socket.emit('error', { message: 'It\'s not your room' });
            }

            // Обновляем активность комнаты
            room.lastActivity = new Date();
            await room.save();

            if (room.fleets[playerName]?.ships && room.fleets[playerName].ships.length) {
                const response = {
                    fleet: room.fleets[playerName].ships,
                    cells: {
                        ownerHitCells: room.fleets[playerName].ships.map(ship => ship.hitCells).flat(),
                    }
                };
                socket.emit('load-game-state', response);
            }
        } catch (e) {
            console.log(e);
            return socket.emit('error', { message: JSON.stringify(e) });
        }
    });

    socket.on('player-left-room', async ({ roomId, player }) => {
        try {
            const playerRoom = await Room.findOne({ id: roomId });
            if (playerRoom && playerRoom?.id) {
                socket.in(playerRoom.id).emit('leave-room', { player });
                playerRoom.playersUUID = [...playerRoom.playersUUID].filter(p => p !== socket.id);
                playerRoom.players = [...playerRoom.players].filter(p => p !== player);
                socket.leave(roomId);

                if (playerRoom.playersUUID?.length < 1 && playerRoom.players?.length < 1) {
                    console.log('Удалил комнату - все ливнули');
                    await Room.deleteOne({ id: roomId });
                } else {
                    playerRoom.lastActivity = new Date();
                    playerRoom.markModified('playersUUID');
                    playerRoom.markModified('players');
                    await playerRoom.save();
                }

                io.emit('existing-rooms', {
                    rooms: await Room.find({}).select('id players').lean(),
                });
            }
        } catch (err) {
            console.error('Error during player left handling:', err);
            socket.emit('error', { message: 'Failed to handle player left' });
        }
    });
};

module.exports = setupRoomHandlers;

