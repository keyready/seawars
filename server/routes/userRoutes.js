const express = require('express');
const router = express.Router();
const { getUserProfile, getLeaderboard, getGames, getRooms, updateProfile, getUserStatistics } = require('../controllers/userController');
const { authenticate } = require('../middleware/auth');

router.get('/leaderboard', getLeaderboard);
router.get('/games', getGames);
router.get('/rooms', getRooms);
router.get('/me/statistics', authenticate, getUserStatistics);
router.get('/:userId', getUserProfile);
router.put('/profile', authenticate, updateProfile);

module.exports = router;
