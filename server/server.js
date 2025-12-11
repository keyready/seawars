const express = require('express');
const http = require('http');
const {Server} = require('socket.io');
const {v4: uuidv4} = require('uuid');
const {findShipAtCell} = require('./lib')
const mongoose = require('mongoose');
const {Gamelogs, Room} = require('./models/index')

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {origin: '*'},
});

io.on('connection', async (socket) => {
    console.log(`✅ \tNew client connected: ${socket.id}`);

    try {
        const [leaderboard, existingRooms] = await Promise.all([
            Gamelogs.find({}).lean(),
            Room.find({}).select('id players').lean()
        ]);

        if (leaderboard.length) {
            socket.emit('leaderboard', {games: leaderboard});
        }
        if (existingRooms.length) {
            socket.emit('existing-rooms', {rooms: existingRooms});
        }
    } catch (err) {
        console.error('Error on connection init:', err);
    }

    socket.on('create-room', async ({name}) => {
        const roomId = uuidv4();

        try {
            const newRoom = new Room({
                id: roomId,
                fleets: {},
                turn: 'waiting',
                started: false,
                players: [name],
                playersUUID: [socket.id],
                createdAt: new Date(),
            });

            await newRoom.save();

            socket.join(roomId);

            io.in(roomId).emit('room-created', {roomId});
            io.emit('existing-rooms', {
                rooms: await Room.find({}).select('id players').lean(),
            });
        } catch (err) {
            console.error('Error creating room:', err);
            socket.emit('error', {message: 'Failed to create room'});
        }
    });

    socket.on('join-room', async ({roomId, name}) => {
        try {
            const room = await Room.findOne({id: roomId});
            if (!room) return socket.emit('error', {message: `Room ${roomId} not found`});
            if (room.players.length >= 2) return socket.emit('error', {message: 'Room is full'});

            room.players.push(name);
            room.playersUUID.push(socket.id);
            await room.save();

            socket.join(roomId);
            socket.emit('joined-room', {roomId, player: name});
            socket.to(roomId).emit('player-joined', { player: name });

            io.emit('existing-rooms', {
                rooms: await Room.find({}).select('id players').lean(),
            });
        } catch (err) {
            console.error('Error joining room:', err);
            socket.emit('error', {message: 'Failed to join room'});
        }
    });

    socket.on('submit-fleet', async ({fleet, player, roomId}) => {
            try {
                let room = await Room.findOne({id: roomId});
                if (!room) return socket.emit('error', {message: `Room ${roomId} not found`});

                if (Object.hasOwn(room.fleets, player)) return socket.emit('error', {message: 'Fleet already submitted'});

                const ships = fleet.filter(Boolean).map(ship => ({
                    head: ship.head,
                    size: ship.size,
                    orientation: ship.orientation,
                    hitCells: [],
                    cells: ship.cells,
                }));

                await Room.updateOne({id: roomId}, {
                    fleets: {
                        ...room.fleets,
                        [player]: {
                            ships: ships,
                            ready: true
                        }
                    }
                })
                console.log(`⚓ \t${player} submitted fleet`);

                room = await Room.findOne({id: roomId});

                const fleetsReady = room.players.length === 2 &&
                    room.players.every(p => Object.hasOwn(room.fleets, p) && room.fleets[p]?.ready);

                if (fleetsReady) {
                    room.started = true;
                    room.turn = room.players[0];
                    await Room.updateOne({id: roomId}, {
                        started: true,
                        turn: room.players[0]
                    })

                    console.log(`▶️ \tGame started in room #${roomId}, turn ${room.turn}`);
                    io.in(roomId).emit('game-start', {turn: room.turn});
                }
            } catch
                (err) {
                console.error('Error submitting fleet:', err);
                socket.emit('error', {message: 'Failed to submit fleet'});
            }
        }
    )
    ;

    socket.on('fire', async ({pos, player, roomId}) => {
        try {
            const room = await Room.findOne({id: roomId});
            if (!room || !room.started) {
                return socket.emit('error', {message: 'Game not started or room not found'});
            }

            if (player !== room.turn) {
                return socket.emit('error', {message: `Not your turn (current: ${room.turn})`});
            }

            const opponent = player === room.players[0] ? room.players[1] : room.players[0];
            if (!room.fleets?.[opponent]?.ready) {
                return socket.emit('error', {message: 'Opponent fleet not ready'});
            }

            const opponentFleet = room.fleets[opponent].ships;
            const { foundShip, hitCell } = findShipAtCell(opponentFleet, pos);

            console.log(foundShip, hitCell)

            let result = 'miss';
            let gameEnded = false;
            let winner = null;

            if (foundShip) {
                result = 'hit';

                // Найдём корабль в fleets[opponent].ships и обновим его hitCells
                const shipToUpdate = room.fleets[opponent].ships.find(s => s.id === foundShip.id);
                if (shipToUpdate) {
                    shipToUpdate.hitCells.push(hitCell);

                    // Проверка на уничтожение
                    if (shipToUpdate.hitCells.length === shipToUpdate.cells.length) {
                        result = 'destroyed';

                        // Проверка на победу
                        const allDestroyed = room.fleets[opponent].ships.every(
                            s => s.hitCells.length === s.cells.length
                        );

                        if (allDestroyed) {
                            result = 'game-over';
                            gameEnded = true;
                            winner = player;

                            // Подсчёт очков
                            const totalOpponentHitCells = room.fleets[opponent].ships.reduce((sum, s) => sum + s.hitCells.length, 0);
                            const totalPlayerHitCells = room.fleets[player]?.ships?.reduce((sum, s) => sum + s.hitCells.length, 0) || 0;

                            // Лог игры
                            const gameLog = new Gamelogs({
                                id: roomId,
                                players: room.players,
                                winnerName: winner,
                                scores: {
                                    [opponent]: totalPlayerHitCells,
                                    [player]: totalOpponentHitCells,
                                },
                                createdAt: room.createdAt,
                                endedAt: new Date(),
                            });

                            await gameLog.save();

                            io.in(roomId).emit('game-over', {winner});
                            io.emit('leaderboard', {
                                games: await Gamelogs.find({}).lean(),
                            });
                        }
                    }
                }
            }

            // Смена хода, если промах или уничтожение без победы
            if (result === 'miss') {
                room.turn = opponent; // передаем ход
            }

            // Сохраняем обновлённую комнату
            if (!gameEnded) {
                room.markModified('fleets');
                await room.save()
            } else {
                // Удаляем комнату после победы
                await Room.deleteOne({id: roomId});
            }

            // Рассылка
            socket.emit('fire-response', {pos, result, turn: room.turn});
            socket.to(roomId).emit('incoming-fire', {target: opponent, pos, result});

            if (!gameEnded) {
                io.in(roomId).emit('turn-changed', {turn: room.turn});
            }

            // Обновим existing-rooms
            io.emit('existing-rooms', {
                rooms: await Room.find({}).select('id players').lean(),
            });

        } catch (err) {
            console.error('Error during fire:', err);
            socket.emit('error', {message: 'Failed to process fire'});
        }
    });

    socket.on('disconnect', async () => {
        console.log(`❌ \tClient disconnected: ${socket.id}`);
        const playerRoom = await Room.findOne({ playersUUID: socket.id })
        if (playerRoom && playerRoom?.id) {
            const leavedPlayerName = playerRoom.players[playerRoom.playersUUID.findIndex(id => id === socket.id)]
            socket.in(playerRoom.id).emit('leave-room', { player:  leavedPlayerName})
            playerRoom.playersUUID.filter(p => p === socket.id)
            playerRoom.players.filter(p => p === leavedPlayerName)
            playerRoom.save()
        }
    });
});


const PORT = process.env.PORT || 5000;
server.listen(PORT, async () => {
    await mongoose.connect('mongodb://127.0.0.1:27017/seawar');

    console.log(`🚀 \tSea Battle Server (static room) running on http://localhost:${PORT}`);
});