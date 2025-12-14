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
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    rank: {
        type: String,
        default: 'Sailor',
        enum: [
            'Sailor',
            'Senior sailor',
            'Foreman of the 2nd article',
            'Foreman of the 1st article',
            'Chief Petty Officer',
            "Chief Ship's Petty Officer",
            'The Midshipman',
            'Senior Midshipman',
            'Second Lieutenant',
            'Lieutenant',
            'Senior Lieutenant',
            'Captain-Lieutenant',
            'Captain of the 3rd rank',
            'Captain of the 2nd rank',
            'Captain of the 1st rank',
            'Rear Admiral',
            'Vice Admiral',
            'The Admiral',
            'Admiral of the Fleet',
        ],
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

UserSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
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

