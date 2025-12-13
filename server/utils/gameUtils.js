function findShipAtCell(ships, pos) {
    const foundShip = ships.find(
        (ship, index) => ship.cells.some(cell => cell.c === pos.r && cell.r === pos.c)
    );

    if (!foundShip) return { foundShip: undefined, hitCell: undefined };

    const hitCell = foundShip.cells.find(cell => cell.c === pos.r && cell.r === pos.c);

    return { foundShip, hitCell };
}

const errorMessages = {
    'ROOM_CREATION_ERROR': 'Failed to create room',
    'ROOM_FULL': 'Room is full',
    'ROOM_JOIN_ERROR': 'Failed to join room',
    'ROOM_NOT_FOUND': 'Room not found',
    'NOT_YOUR_ROOM_ERROR': 'It\'s not your room',
    'FLEET_ALREADY_SUBMITTED': 'Fleet already submitted',
    'SUBMIT_FLEET_ERROR': 'Failed to submit fleet',
    'GAME_STARTED_ERROR': 'Game not started or room not found',
    'NOT_YOUR_TURN': `Not your turn`,
    'OPPONENT_FLEET_ERROR': 'Opponent fleet not ready',
    'FIRE_ERROR': 'Failed to process fire',
    'PLAYER_LEFT_ERROR': 'Failed to handle player left',
};

module.exports = {
    findShipAtCell,
    errorMessages,
};

