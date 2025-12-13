const mongoose = require('mongoose');
const {Schema} = require("mongoose");

const RoomSchema = new Schema({
    id: String,
    fleets: {
        type: Object,
        default: {}
    },
    turn: String,
    started: Boolean,
    players: [String],
    playersUUID: [String],
    createdAt: Date,
    lastActivity: {
        type: Date,
        default: Date.now
    },
});

const Room = mongoose.model('Room', RoomSchema);

module.exports = Room