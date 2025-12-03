const Message = require('../models/Message');

exports.getMessages = async (req, res) => {
    try {
        const { channelId } = req.params;
        const { page = 1, limit = 50 } = req.query;

        const messages = await Message.find({ channel: channelId })
            .sort({ timestamp: -1 }) // Newest first
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .populate('sender', 'username email') // Populate sender info
            .lean();

        // Reverse to show oldest first in chat view, but we fetched newest first for pagination
        res.status(200).json(messages.reverse());
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ message: 'Server error fetching messages' });
    }
};

// Note: Sending messages will primarily happen via Socket.io, 
// but an API endpoint can be useful for fallback or specific use cases.
exports.createMessage = async (req, res) => {
    try {
        const { channelId, content } = req.body;
        const senderId = req.userId; // Assuming auth middleware adds user to req

        const newMessage = new Message({
            channel: channelId,
            sender: senderId,
            content
        });

        await newMessage.save();

        // Ideally, we should emit a socket event here too if using REST for sending
        // const io = require('../sockets/chat.socket').getIO();
        // io.to(channelId).emit('receive_message', await newMessage.populate('sender', 'username'));

        res.status(201).json(newMessage);
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ message: 'Server error sending message' });
    }
}
