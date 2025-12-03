const Channel = require('../models/Channel');

exports.getChannels = async (req, res) => {
    try {
        const channels = await Channel.find().populate('members', 'username email');
        res.status(200).json(channels);
    } catch (error) {
        console.error('Error fetching channels:', error);
        res.status(500).json({ message: 'Server error fetching channels' });
    }
};

exports.createChannel = async (req, res) => {
    try {
        const { name, description } = req.body;

        if (!name) {
            return res.status(400).json({ message: 'Channel name is required' });
        }

        const existingChannel = await Channel.findOne({ name });
        if (existingChannel) {
            return res.status(400).json({ message: 'Channel already exists' });
        }

        const newChannel = new Channel({
            name,
            description,
            // Optionally add creator as a member automatically
            // members: [req.user.id] 
        });

        await newChannel.save();
        res.status(201).json(newChannel);
    } catch (error) {
        console.error('Error creating channel:', error);
        res.status(500).json({ message: 'Server error creating channel' });
    }
};
