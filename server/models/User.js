const mongoose = require('mongoose');
const {Schema} = require('mongoose');
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
        default: 'sailor',
        enum: [
            'sailor',
            'seniorSailor',
            'foreman2nd',
            'foreman1st',
            'chiefPettyOfficer',
            "chiefShipPettyOfficer",
            'midshipman',
            'seniorMidshipman',
            'juniorLieutenant',
            'lieutenant',
            'seniorLieutenant',
            'captainLieutenant',
            'captain3rdRank',
            'captain2ndRank',
            'captain1stRank',
            'rearAdmiral',
            'viceAdmiral',
            'admiral',
            'fleetAdmiral',
        ],
    },
    rating: {
        type: Number,
        default: 0,
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
    }
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

UserSchema.methods.updateRank = function () {
    const r = this.rating;
    if (r >= 3800) this.rank = 'fleetAdmiral';
    else if (r >= 3500) this.rank = 'admiral';
    else if (r >= 3300) this.rank = 'viceAdmiral';
    else if (r >= 3100) this.rank = 'rearAdmiral';
    else if (r >= 2900) this.rank = 'captain1stRank';
    else if (r >= 2700) this.rank = 'captain2ndRank';
    else if (r >= 2500) this.rank = 'captain3rdRank';
    else if (r >= 2300) this.rank = 'captainLieutenant';
    else if (r >= 2100) this.rank = 'seniorLieutenant';
    else if (r >= 1900) this.rank = 'lieutenant';
    else if (r >= 1700) this.rank = 'juniorLieutenant';
    else if (r >= 1500) this.rank = 'seniorMidshipman';
    else if (r >= 1300) this.rank = 'midshipman';
    else if (r >= 1100) this.rank = 'chiefShipPettyOfficer';
    else if (r >= 900) this.rank = 'chiefPettyOfficer';
    else if (r >= 700) this.rank = 'foreman1st';
    else if (r >= 500) this.rank = 'foreman2nd';
    else if (r >= 300) this.rank = 'seniorSailor';
    else this.rank = 'sailor'; // >=0
};

/**
 *
 * @param isWinner победил?
 * @param opponentRating рейтинг противника
 * @param selfCells сколько клеток подбил
 * @param oppCells сколько клеток потерял
 */
UserSchema.methods.updateGameStats = function (isWinner, opponentRating, selfCells, oppCells) {
    console.log(isWinner, opponentRating, selfCells, oppCells)

    this.gamesPlayed += 1;
    this.lastGameDate = new Date();
    this.lastOnlineDate = new Date();

    if (isWinner) {
        this.gamesWon += 1;
    }

    let K = 32;

    const ratingDiff = opponentRating - this.rating;
    const E = 1 / (1 + Math.pow(10, ratingDiff / 400));

    const S = isWinner ? 1 : 0;

    let delta = K * (S - E);
    console.log('delta 1', delta)

    const totalCells = 20;
    const dominance = Math.abs(selfCells - oppCells) / totalCells; // 0..1

    if (isWinner && selfCells > oppCells) {
        delta *= (1 + 0.5 * dominance);
    } else if (!isWinner && oppCells > selfCells) {
        delta *= (0.7 + 0.3 * (1 - dominance));
    }

    console.log('delta 2', delta)

    const MAX_DELTA = 100;
    delta = Math.max(-MAX_DELTA, Math.min(MAX_DELTA, delta));
    console.log('delta 3', delta)

    console.log('result rating after game', Math.max(0, Math.round(this.rating + delta)))
    this.rating = Math.max(0, Math.round(this.rating + delta));

    this.updateRank();
};

const User = mongoose.model('User', UserSchema);

module.exports = User;

