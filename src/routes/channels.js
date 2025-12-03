const express = require('express');
const router = express.Router();
const { getChannels, createChannel, joinChannel, leaveChannel, updateChannel, deleteChannel } = require('../controllers/channelController');
const auth = require('../middleware/authMiddleware');

router.get('/', auth, getChannels);
router.post('/', auth, createChannel);
router.put('/:channelId', auth, updateChannel);
router.delete('/:channelId', auth, deleteChannel);
router.post('/:channelId/join', auth, joinChannel);
router.post('/:channelId/leave', auth, leaveChannel);

module.exports = router;
