const express = require('express');
const http = require('http');
const {Server} = require('socket.io');
const {v4: uuidv4} = require('uuid');
const cron = require('node-cron')

function findShipAtCell(ships, pos) {
    const foundShip = ships.find(
        (ship, index) => ship.cells.some(cell => cell.c === pos.r && cell.r === pos.c)
    )

    if (!foundShip) return {ship: undefined, hitCell: undefined};

    const hitCell = foundShip.cells.find(cell => cell.r === pos.r && cell.c === pos.c)

    return {foundShip, hitCell}
}

const rooms = {}

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {origin: '*'},
});

const gamesLogs = {}

io.on('connection', (socket) => {
    console.log(`✅ \tNew client connected: ${socket.id}`);

    if (Object.keys(gamesLogs).length) {
        socket.emit('leaderboard', {
            games: Object.keys(gamesLogs).filter(Boolean).map(game => {
                if (!gamesLogs[game]?.endedAt) return undefined
                return ({
                    id: game,
                    players: gamesLogs[game].players,
                    winnerName: gamesLogs[game].winnerName,
                    createdAt: gamesLogs[game].createdAt,
                    endedAt: gamesLogs[game].endedAt,
                    scores: gamesLogs[game].scores,
                });
            })
        })
    }

    if (Object.keys(rooms).length) {
        socket.emit('existing-rooms', {
            rooms: Object.keys(rooms).map(game => ({
                id: game,
                players: rooms[game].players.length
            }))
        })
    }

    socket.on('create-room', ({name}) => {
        const roomId = uuidv4()
        rooms[roomId] = {
            fleets: {},
            turn: 'waiting',
            started: false,
            players: [],
            createdAt: new Date(),
        }
        console.log(`✅ \tRoom created: ${roomId}`)

        console.log(`✅ \tPlayer ${name} joined the room: ${roomId}`)
        rooms[roomId].players.push(name);

        socket.join(roomId)
        io.in(roomId).emit('room-created', {roomId})

        io.emit('existing-rooms', {
            rooms: Object.keys(rooms).map(room => ({
                id: room,
                playersLength: rooms[room].players.length
            }))
        })
    })

    socket.on('join-room', ({roomId, name}) => {
        if (!rooms.hasOwnProperty(roomId)) {
            return socket.emit('error', {message: `There is no room with ID = ${roomId} `})
        }
        if (rooms[roomId].players.length >= 2) {
            return socket.emit('error', {message: `There are already 2 players in the room `})
        }

        rooms[roomId].players.push(name);
        console.log(`✅ \tPlayer ${name} joined the room: ${roomId}`)

        socket.join(roomId);
        socket.emit('joined-room', {roomId, player: name});
        io.to(roomId).emit('player-joined', {player: name});

        io.emit('existing-rooms', {
            rooms: Object.keys(rooms).map(room => ({
                id: room,
                playersLength: rooms[room].players.length
            }))
        })
    })

    socket.on('submit-fleet', ({fleet, player, roomId}) => {
        if (!rooms.hasOwnProperty(roomId)) {
            socket.emit('error', {message: `There is no room with ID = ${roomId} `})
        }

        if (rooms[roomId].fleets[player]) {
            return socket.emit('error', {message: 'Fleet already submitted'});
        }

        rooms[roomId].fleets[player] = {
            ships: fleet.filter(Boolean),
            ready: true
        };
        console.log(`⚓ \t${player} submitted fleet`);

        if (rooms[roomId].players.length === 2 && Object.keys(rooms[roomId].fleets).every(player => rooms[roomId].fleets[player].ready)) {
            rooms[roomId].started = true;
            rooms[roomId].turn = player;
            console.log(`▶️ \tGame started in room #${roomId}, turn ${rooms[roomId].turn}`);
            io.in(roomId).emit('game-start', {turn: player});
        }
    });

    socket.on('fire', ({pos, player, roomId}) => {
        if (!rooms[roomId].started) {
            socket.emit('error', {message: 'Game not started'});
            return;
        }

        if (player !== rooms[roomId].turn) {
            socket.emit('error', {message: `Not your turn (current: ${rooms[roomId].turn})`});
            return;
        }


        const opponent = player === rooms[roomId].players[0] ? rooms[roomId].players[1] : rooms[roomId].players[0];
        const opponentFleet = rooms[roomId].fleets[opponent]?.ships;

        if (!opponentFleet) {
            socket.emit('error', {message: 'Opponent fleet not ready'});
            return;
        }

        opponentFleet.forEach(s => console.log(s))

        const {foundShip, hitCell} = findShipAtCell(opponentFleet, pos);

        let result = 'miss';

        if (foundShip) {
            result = 'hit';

            foundShip.hitCells = [...foundShip.hitCells, hitCell];
            rooms[roomId].fleets[opponent].ships = [
                ...rooms[roomId].fleets[opponent]?.ships.map(ship => ship.id === foundShip.id ? foundShip : ship)
            ]

            if (foundShip.hitCells.length === foundShip.cells.length) {
                result = 'destroyed'

                if (rooms[roomId].fleets[opponent].ships.every(ship => ship.cells.length === ship.hitCells.length)) {
                    const totalOpponentHitCells = rooms[roomId].fleets[opponent].ships
                        .reduce((sum, ship) => sum + ship.hitCells.length, 0);
                    const totalPlayerHitCells = rooms[roomId].fleets[player].ships
                        .reduce((sum, ship) => sum + ship.hitCells.length, 0);

                    gamesLogs[roomId] = {};
                    gamesLogs[roomId].createdAt = rooms[roomId].createdAt;
                    gamesLogs[roomId].endedAt = new Date();
                    gamesLogs[roomId].players = rooms[roomId].players;
                    gamesLogs[roomId].winnerName = player;
                    gamesLogs[roomId].scores = {[opponent]: totalPlayerHitCells, [player]: totalOpponentHitCells};

                    io.in(roomId).emit('game-over', {winner: player});

                    delete rooms[roomId];
                    console.log(rooms)

                    return io.emit('existing-rooms', {
                        rooms: Object.keys(rooms).map(room => ({
                            id: room,
                            playersLength: rooms[room].players.length
                        }))
                    })
                }
            }
        }

        if (result === 'miss') {
            rooms[roomId].turn = opponent;
            io.in(roomId).emit('turn-changed', {turn: opponent});
        }

        console.log(`[FIRE]:\tFire result\t${result}`)

        socket.emit('fire-response', {pos, result, turn: rooms[roomId].turn});
        socket.to(roomId).emit('incoming-fire', {target: opponent, pos, result});
    });

    socket.on('disconnect', () => {
        console.log(`❌ \tClient disconnected: ${socket.id}`);
    });
});

// cron.schedule('*/2 * * * * *', () => {
//     const roomsNames = Object.keys(rooms)
//     console.log('[WW]: Gamestate:')
//     roomsNames.forEach(n => {
//         console.log(`\t-- ${n}:`);
//         console.log(`\t\t players: ${rooms[n].players.join(', ')}`)
//         console.log(`\t\t turn: ${rooms[n].turn}`)
//     })
// });

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`🚀 \tSea Battle Server (static room) running on http://localhost:${PORT}`);
    console.log(`   \tRoom: 'main-room'`);
    console.log(`   \tPlayers: 'player1', 'player2'`);
});