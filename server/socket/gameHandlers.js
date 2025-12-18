const {Room, Gamelogs} = require('../models');
const {processFire, createGameLog} = require('../services/gameService');

const setupGameHandlers = (io, socket) => {
    socket.on('submit-fleet', async ({fleet, player, roomId}) => {
        try {
            let room = await Room.findOne({id: roomId});
            if (!room) return socket.emit('error', {message: `Room ${roomId} not found`});

            const playerName = socket.user?.username || player;
            if (Object.hasOwn(room.fleets, playerName)) {
                return socket.emit('error', {message: 'Fleet already submitted'});
            }

            const ships = fleet.filter(Boolean).map(ship => ({
                id: ship.id,
                head: ship.head,
                size: ship.size,
                orientation: ship.orientation,
                hitCells: [],
                cells: ship.cells,
            }));

            room.fleets[playerName] = {
                ships,
                ready: true
            };
            console.log(`⚓ \t${playerName} submitted fleet`);
            socket.in(roomId).emit('fleet-submitted', {player: playerName});

            const fleetsReady = room.players.length === 2 &&
                room.players.every(p => Object.hasOwn(room.fleets, p) && room.fleets[p]?.ready);

            if (fleetsReady) {
                room.started = true;
                room.turn = room.players[0];

                console.log(`▶️ \tGame started in room #${roomId}, turn ${room.turn}`);
                io.in(roomId).emit('game-start', {turn: room.turn});
            }

            room.lastActivity = new Date();
            room.markModified('fleets');
            await room.save();
        } catch (err) {
            console.error('Error submitting fleet:', err);
            socket.emit('error', {message: 'Failed to submit fleet'});
        }
    });

    socket.on('fire', async ({pos, player, roomId}) => {
        try {
            const room = await Room.findOne({id: roomId});
            if (!room || !room.started) {
                return socket.emit('error', {message: 'Game not started or room not found'});
            }

            const playerName = socket.user?.username || player;
            if (playerName !== room.turn) {
                return socket.emit('error', {message: `Not your turn (current: ${room.turn})`});
            }

            const {result, gameEnded, winner, opponent} = processFire(room, playerName, pos);

            if (!gameEnded) {
                room.lastActivity = new Date();
                room.markModified('fleets');
                await room.save();
            } else {
                // Создаем лог игры и обновляем статистику
                await createGameLog(room, winner);

                // Удаляем комнату после победы
                await Room.deleteOne({id: roomId});

                io.in(roomId).emit('game-over', {winner});
                io.emit('leaderboard', {
                    games: await Gamelogs.find({}).lean(),
                });
            }

            // Рассылка
            socket.emit('fire-response', {pos, result, turn: room.turn});
            socket.to(roomId).emit('incoming-fire', {target: opponent, pos, result});

            if (!gameEnded) {
                io.in(roomId).emit('turn-changed', {turn: room.turn});
            }

            // Обновим existing-rooms
            io.emit('existing-rooms', await Room.find({}).select('id players').lean());
        } catch (err) {
            console.error('Error during fire:', err);
            socket.emit('error', {message: err.message || 'Failed to process fire'});
        }
    });

    socket.on('weakness-support', async ({roomId, player, helpType, helpParams}) => {
        try {
            const room = await Room.findOne({id: roomId});
            const {horLine} = helpParams;
            switch (helpType) {
                case 'airforces': {
                    const cellsToDestroy = new Array(10)
                        .fill(0)
                        .map((_, index) => ({
                            r: horLine, c: index
                        }));
                    for (let i = 0; i < cellsToDestroy.length; i++) {
                        const {opponent, result, gameEnded, winner} = processFire(room, player, cellsToDestroy[i]);

                        if (!gameEnded) {
                            room.lastActivity = new Date();
                            room.markModified('fleets');
                            await room.save();
                        } else {
                            await createGameLog(room, winner);

                            await Room.deleteOne({id: roomId});

                            io.in(roomId).emit('game-over', {winner});
                            io.emit('leaderboard', {
                                games: await Gamelogs.find({}).lean(),
                            });
                        }

                        socket.to(roomId).emit('incoming-fire', {target: opponent, pos: cellsToDestroy[i], result})
                        socket.emit('fire-response', {pos: cellsToDestroy[i], result, turn: room.turn});

                        if (!gameEnded) {
                            io.in(roomId).emit('turn-changed', {turn: room.turn});
                        }

                        io.emit('existing-rooms', await Room.find({}).select('id players').lean());
                    }
                    break;
                }
            }

        } catch (err) {
            console.error('Error submitting fleet:', err);
            socket.emit('error', {message: 'Failed to submit fleet'});
        }
    })

    socket.on('cheat-request', async ({player, roomId}) => {
        const room = await Room.findOne({id: roomId});
        const enemy = room.players.filter(pl => pl !== player)
        return socket.emit('cheat-answer', {enemyFleet: room.fleets[enemy].ships})
    })
};

module.exports = setupGameHandlers;

