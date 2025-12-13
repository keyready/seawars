const express = require('express');
const router = express.Router();
const { getUserProfile, getLeaderboard, updateProfile } = require('../controllers/userController');
const { authenticate } = require('../middleware/auth');

router.get('/leaderboard', getLeaderboard);
router.get('/:userId', getUserProfile);
router.put('/profile', authenticate, updateProfile);

module.exports = router;

