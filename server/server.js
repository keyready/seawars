// server.js
const express = require('express');
const http = require('http');
const {Server} = require('socket.io');
const {v4: uuidv4} = require('uuid');
const cron = require('node-cron')

// Вспомогательные функции (встроены для простоты)
function computeShipCells(head, size, orientation) {
    const cells = [];
    for (let i = 0; i < size; i++) {
        if (orientation === 'hor') {
            cells.push({row: head.r, col: head.c + i});
        } else if (orientation === 'ver') {
            cells.push({row: head.r + i, col: head.c});
        }
    }
    return cells;
}

function findShipAtCell(ships, pos) {
    const foundShip = ships.find(ship =>
        ship.cells.some(cell => cell.row === pos.r && cell.col === pos.c)
    )
    if (!foundShip) return {ship: undefined, hitCell: undefined};

    const hitCell = foundShip.cells.find(cell => cell.row === pos.r && cell.col === pos.c)

    return {foundShip, hitCell}
}

const rooms = {}

const gameState = {
    fleets: {},
    turn: 'waiting', // чей ход
    started: false,
    players: []
};

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {origin: '*'}, // для разработки
});

io.on('connection', (socket) => {
    console.log(`✅ \tNew client connected: ${socket.id}`);

    socket.on('create-room', ({name}) => {
        const roomId = uuidv4()
        rooms[roomId] = {
            fleets: {},
            turn: 'waiting',
            started: false,
            players: []
        }
        console.log(`✅ \tRoom created: ${roomId}`)
        socket.join(roomId)
        io.in(roomId).emit('room-created', {roomId})
    })

    socket.on('join-room', ({roomId, name}) => {
        if (!rooms.hasOwnProperty(roomId)) {
            return socket.emit('error', {message: `There is no room with ID = ${roomId}`})
        }
        if (rooms[roomId].players.length > 2) {
            return socket.emit('error', {message: `There are already 2 players in the room`})
        }

        console.log(`✅ \tPlayer ${name} joined the room: ${roomId}`)
        socket.join(roomId);
        socket.emit('joined-room', { roomId, player: name });
        io.to(roomId).emit('player-joined', { player: name });
    })

    socket.on('submit-fleet', ({fleet, player, roomId}) => {
        if (!rooms.hasOwnProperty(roomId)) {
            socket.emit('error', {message: `There is no room with ID = ${roomId}`})
        }

        if (rooms[roomId].fleets[player]) {
            return socket.emit('error', { message: 'Fleet already submitted' });
        }
        rooms[roomId].players.push(player); // только первый раз

        rooms[roomId].fleets[player] = {
            ships: fleet.filter(Boolean).map(ship => ({
                ...ship,
                cells: computeShipCells(ship.head, ship.size, ship.orientation)
            })),
            ready: true
        };
        console.log(`⚓ \t${player} submitted fleet`);

        if (rooms[roomId].players.length === 2 && Object.keys(rooms[roomId].fleets).every(player => rooms[roomId].fleets[player].ready)) {
            rooms[roomId].started = true;
            rooms[roomId].turn = player;
            console.log(`▶️ \tGame started in room #${roomId}, turn ${rooms[roomId].turn}`);
            io.in(roomId).emit('game-start', { turn: player });
        }
    });

    socket.on('fire', ({ pos, player, roomId }) => {
        if (!rooms[roomId].started) {
            socket.emit('error', { message: 'Game not started' });
            return;
        }

        if (player !== rooms[roomId].turn) {
            socket.emit('error', { message: `Not your turn (current: ${rooms[roomId].turn})` });
            return;
        }

        // Определяем противника
        const opponent = player === rooms[roomId].players[0] ? rooms[roomId].players[1] : rooms[roomId].players[0];
        const opponentFleet = rooms[roomId].fleets[opponent]?.ships;

        if (!opponentFleet) {
            socket.emit('error', { message: 'Opponent fleet not ready' });
            return;
        }

        // Проверяем попадание
        const { foundShip, hitCell } = findShipAtCell(opponentFleet, pos);

        let result = 'miss';

        if (foundShip) {
            result = 'hit'

            foundShip.hitCells = [...foundShip.hitCells, hitCell];
            rooms[roomId].fleets[opponent].ships = [
                ...rooms[roomId].fleets[opponent]?.ships.map(ship => ship.id === foundShip.id ? foundShip : ship)
            ]

            if (foundShip.hitCells.length === foundShip.cells.length) {
                result = 'destroyed'

                if (rooms[roomId].fleets[opponent].ships.every(ship => ship.cells.length === ship.hitCells.length)) {
                    socket.emit('game-over', { winner: player });
                    io.in(roomId).emit('game-over', { winner: player });
                    delete rooms[roomId]
                }
            }
        }

        if (result === 'miss') {
            rooms[roomId].turn = opponent;
            io.in(roomId).emit('turn-changed', { turn: opponent });
        }

        console.log(`[FIRE]:\tFire result\t${result}`)

        socket.emit('fire-response', { pos, result, turn: rooms[roomId].turn });
        socket.to(roomId).emit('incoming-fire', { target: opponent, pos, result });
    });

    socket.on('disconnect', () => {
        console.log(`❌ \tClient disconnected: ${socket.id}`);
        socket.broadcast.emit('game-end');
        // gameState.fleets = {}
        // gameState.turn = 'waiting'
        // gameState.started = false
        // gameState.players = []
    });

    cron.schedule('*/2 * * * * *', () => {
        const roomsNames = Object.keys(rooms)
        roomsNames.forEach(n => io.in(rooms[n]).emit('ping', 'pong'))
    });
});

cron.schedule('*/2 * * * * *', () => {
    const roomsNames = Object.keys(rooms)
    console.log('[WW]: Gamestate:')
    roomsNames.forEach(n => {
        console.log(`\t-- ${n}:`);
        console.log(`\t\t players: ${rooms[n].players.join(', ')}`)
        console.log(`\t\t turn: ${rooms[n].turn}`)
    })
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`🚀 \tSea Battle Server (static room) running on http://localhost:${PORT}`);
    console.log(`   \tRoom: 'main-room'`);
    console.log(`   \tPlayers: 'player1', 'player2'`);
});