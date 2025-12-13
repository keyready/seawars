const mongoose = require('mongoose');
const { Schema } = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 20,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    rank: {
        type: String,
        default: 'Новичок',
        enum: ['Новичок', 'Матрос', 'Старшина', 'Лейтенант', 'Капитан', 'Адмирал'],
    },
    rating: {
        type: Number,
        default: 1000,
        min: 0,
    },
    gamesPlayed: {
        type: Number,
        default: 0,
        min: 0,
    },
    gamesWon: {
        type: Number,
        default: 0,
        min: 0,
    },
    lastGameDate: {
        type: Date,
        default: null,
    },
    lastOnlineDate: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
});

// Хеширование пароля перед сохранением
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Метод для сравнения паролей
UserSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Метод для обновления звания на основе рейтинга
UserSchema.methods.updateRank = function () {
    if (this.rating >= 2500) {
        this.rank = 'Адмирал';
    } else if (this.rating >= 2000) {
        this.rank = 'Капитан';
    } else if (this.rating >= 1500) {
        this.rank = 'Лейтенант';
    } else if (this.rating >= 1200) {
        this.rank = 'Старшина';
    } else if (this.rating >= 1000) {
        this.rank = 'Матрос';
    } else {
        this.rank = 'Новичок';
    }
};

// Метод для обновления статистики после игры
UserSchema.methods.updateGameStats = function (isWinner) {
    this.gamesPlayed += 1;
    this.lastGameDate = new Date();
    this.lastOnlineDate = new Date();
    
    if (isWinner) {
        this.gamesWon += 1;
        this.rating += 20; // Победа дает +20 рейтинга
    } else {
        this.rating = Math.max(0, this.rating - 10); // Поражение дает -10 рейтинга
    }
    
    this.updateRank();
};

const User = mongoose.model('User', UserSchema);

module.exports = User;

