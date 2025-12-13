const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config({
    path: "../.env"
});

const connectDB = require('./config/database');
const setupSocket = require('./socket/index');
const setupRoomCleanup = require('./services/roomCleanupService');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
const server = http.createServer(app);

// Настройка CORS
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Настройка Socket.IO
const io = new Server(server, {
    path: '/socket',
    cors: { origin: '*' },
});

// Подключение к базе данных
connectDB();

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
});

// Настройка Socket.IO
setupSocket(io);

// Настройка очистки неактивных комнат
setupRoomCleanup(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`🚀 \tSea Battle Server running on http://localhost:${PORT}`);
});
