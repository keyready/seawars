const {Room, Gamelogs, User} = require('../models');
const {findShipAtCell} = require('../utils/gameUtils');

const updateUserStatsAfterGame = async (winnerName, loserName, totalWinnerHitCells, totalOpponentHitCells) => {
    try {

        const winner = await User.findOne({username: winnerName});
        const loser = await User.findOne({username: loserName});

        const winnerRating = winner?.rating ? winner?.rating : 1000
        const loserRating = loser?.rating ? loser?.rating : 1000

        console.log(
            'winnerRating', winnerRating,
            'loserRating', loserRating
        )

        if (winner) {
            winner.updateGameStats(true, loserRating, totalOpponentHitCells, totalWinnerHitCells);
            await winner.save();
        }

        if (loser) {
            loser.updateGameStats(false, winnerRating, totalWinnerHitCells, totalOpponentHitCells);
            await loser.save();
        }
        
        return {
            winnerDelta: winnerRating - await User.find({username: winnerName }).rating,
            loserDelta: loserRating - await User.find({username: loserName }).rating
        }
    } catch (error) {
        console.error('Ошибка обновления статистики пользователей:', error);
    }
};

const processFire = (room, player, pos) => {
    const opponent = player === room.players[0] ? room.players[1] : room.players[0];

    if (!room.fleets?.[opponent]?.ready) {
        throw new Error('Opponent fleet not ready');
    }

    const opponentFleet = room.fleets[opponent].ships;
    const {foundShip, hitCell} = findShipAtCell(opponentFleet, pos);

    let result = 'miss';
    let gameEnded = false;
    let winner = null;

    if (foundShip) {
        result = 'hit';

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
                }
            }
        }
    }

    if (result === 'miss') {
        room.turn = opponent;
    }

    return {result, gameEnded, winner, opponent};
};

const createGameLog = async (room, winner) => {
    const opponent = winner === room.players[0] ? room.players[1] : room.players[0];

    const totalOpponentHitCells = room.fleets[opponent].ships.reduce(
        (sum, s) => sum + s.hitCells.length, 0
    );
    const totalWinnerHitCells = room.fleets[winner]?.ships?.reduce(
        (sum, s) => sum + s.hitCells.length, 0
    ) || 0;

    const {loserRating, winnerRating} = await updateUserStatsAfterGame(winner, opponent, totalWinnerHitCells, totalOpponentHitCells);

    const gameLog = new Gamelogs({
        id: room.id,
        players: room.players,
        winnerName: winner,
        scores: {
            [opponent]: totalWinnerHitCells,
            [winner]: totalOpponentHitCells,
        },
        createdAt: room.createdAt,
        endedAt: new Date(),
        ratingDelta: [loserRating, winnerRating]
    });

    await gameLog.save();

    return gameLog;
};

module.exports = {
    processFire,
    createGameLog,
    updateUserStatsAfterGame,
};

