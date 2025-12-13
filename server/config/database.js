const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_CONNECTION_URL);
        console.log('✅ \tMongoDB connected');
    } catch (error) {
        console.error('❌ \tMongoDB connection error:', error);
        process.exit(1);
    }
};

module.exports = connectDB;

