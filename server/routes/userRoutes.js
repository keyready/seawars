const express = require('express');
const router = express.Router();
const { getUserProfile, getLeaderboard, getGames, getRooms, updateProfile } = require('../controllers/userController');
const { authenticate } = require('../middleware/auth');

router.get('/leaderboard', getLeaderboard);
router.get('/games', getGames);
router.get('/rooms', getRooms);
router.get('/:userId', getUserProfile);
router.put('/profile', authenticate, updateProfile);

module.exports = router;

