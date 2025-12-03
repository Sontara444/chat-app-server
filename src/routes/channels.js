const express = require('express');
const router = express.Router();
const { getChannels, createChannel, joinChannel, leaveChannel } = require('../controllers/channelController');
const auth = require('../middleware/authMiddleware');

router.get('/', auth, getChannels);
router.post('/', auth, createChannel);
router.post('/:channelId/join', auth, joinChannel);
router.post('/:channelId/leave', auth, leaveChannel);

module.exports = router;
