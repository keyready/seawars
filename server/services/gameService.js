const {Room, Gamelogs, User} = require('../models');
const {findShipAtCell} = require('../utils/gameUtils');

const updateUserStatsAfterGame = async (winnerName, loserName, totalWinnerHitCells, totalOpponentHitCells) => {
    try {
        const winner = await User.findOne({username: winnerName});
        const loser = await User.findOne({username: loserName});

        const oldWinnerRating = winner?.rating || 1000;
        const oldLoserRating = loser?.rating || 1000;
        const oldWinnerRank = winner?.rank || 'sailor';
        const oldLoserRank = loser?.rank || 'sailor';

        console.log('Старые рейтинги и звания:', {
            winner: winnerName,
            winnerRating: oldWinnerRating,
            winnerRank: oldWinnerRank,
            loser: loserName,
            loserRating: oldLoserRating,
            loserRank: oldLoserRank
        });

        if (winner) {
            winner.updateGameStats(true, oldLoserRating, totalOpponentHitCells, totalWinnerHitCells);
            await winner.save();
        }

        if (loser) {
            loser.updateGameStats(false, oldWinnerRating, totalWinnerHitCells, totalOpponentHitCells);
            await loser.save();
        }

        // Получаем новые рейтинги и звания после обновления
        const newWinnerRating = winner?.rating || 1000;
        const newLoserRating = loser?.rating || 1000;
        const newWinnerRank = winner?.rank || 'sailor';
        const newLoserRank = loser?.rank || 'sailor';

        const winnerDelta = newWinnerRating - oldWinnerRating;
        const loserDelta = newLoserRating - oldLoserRating;
        const winnerRankChanged = newWinnerRank !== oldWinnerRank;
        const loserRankChanged = newLoserRank !== oldLoserRank;

        console.log('Изменения рейтинга и званий после игры:', {
            winner: winnerName,
            winnerDelta: winnerDelta,
            winnerRankChanged: winnerRankChanged,
            newWinnerRating: newWinnerRating,
            newWinnerRank: newWinnerRank,
            loser: loserName,
            loserDelta: loserDelta,
            loserRankChanged: loserRankChanged,
            newLoserRating: newLoserRating,
            newLoserRank: newLoserRank
        });

        return {
            winnerDelta,
            loserDelta,
            winnerRankChanged,
            loserRankChanged,
            newWinnerRank,
            newLoserRank
        };
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

    const {winnerDelta, loserDelta, winnerRankChanged, loserRankChanged, newWinnerRank, newLoserRank} = await updateUserStatsAfterGame(winner, opponent, totalWinnerHitCells, totalOpponentHitCells);

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
        ratingDelta: [loserDelta, winnerDelta]
    });

    await gameLog.save();

    return {
        gameLog,
        ratingChanges: {
            [winner]: {
                delta: winnerDelta,
                rankChanged: winnerRankChanged,
                newRank: newWinnerRank
            },
            [opponent]: {
                delta: loserDelta,
                rankChanged: loserRankChanged,
                newRank: newLoserRank
            }
        }
    };
};

const applyBonusPenalty = async (playerName, bonusType) => {
    try {
        const user = await User.findOne({username: playerName});
        if (!user) return;


        let penalty = 0;
        if (bonusType === 'bomb') {
            penalty = 20;
        } else if (bonusType === 'airforces') {
            penalty = 50;
        }

        if (user.rating < penalty) {
            return 'Недостаточно рейтинга для применения усиления'
        }

        if (penalty > 0) {
            user.rating = Math.max(0, user.rating - penalty);
            user.updateRank();
            await user.save();
            console.log(`💣 \t${playerName} used ${bonusType}, rating decreased by ${penalty} points`);
        }
    } catch (error) {
        console.error('Ошибка при списывании рейтинга за бонус:', error);
    }
};

module.exports = {
    processFire,
    createGameLog,
    updateUserStatsAfterGame,
    applyBonusPenalty,
};

