const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const ChatMessageSchema = new Schema({
    roomId: {
        type: String,
        required: true,
        index: true
    },
    sender: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50
    },
    text: {
        type: String,
        required: true,
        trim: true,
        maxlength: 500
    },
    createdAt: {
        type: Date,
        default: Date.now,
        index: true
    }
}, {
    timestamps: true
});

// Индекс для быстрого поиска сообщений по комнате и времени
ChatMessageSchema.index({ roomId: 1, createdAt: -1 });

const ChatMessage = mongoose.model('ChatMessage', ChatMessageSchema);

module.exports = ChatMessage;
