const mongoose = require('mongoose');
const {Schema} = require("mongoose");

const GameLogSchema = new Schema({
    id: String,
    players: [String],
    winnerName: String,
    scores: {
        type: Object,
        default: {}
    },
    createdAt: Date,
    endedAt: Date,
    ratingDelta: [Number]
});

const Gamelogs = mongoose.model('Gamelogs', GameLogSchema);

module.exports = Gamelogs
