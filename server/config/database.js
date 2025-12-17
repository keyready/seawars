const mongoose = require('mongoose');
const {User} = require("../models");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_CONNECTION_URL);
        // await User.updateMany(
        //     {
        //         $or: [
        //             { winstreak: { $exists: false } },
        //             { losestreak: { $exists: false } },
        //             { maxWinstreak: { $exists: false } }
        //         ]
        //     },
        //     {
        //         $set: {
        //             winstreak: 0,
        //             losestreak: 0,
        //             maxWinstreak: 0,
        //         }
        //     }
        // )
        console.log('✅ \tMongoDB connected');
    } catch (error) {
        console.error('❌ \tMongoDB connection error:', error);
        process.exit(1);
    }
};

module.exports = connectDB;

