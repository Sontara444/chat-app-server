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
            members: [req.userId] // Add creator as a member automatically
        });

        await newChannel.save();
        // Populate members to match getChannels structure
        await newChannel.populate('members', 'username email');

        res.status(201).json(newChannel);
    } catch (error) {
        console.error('Error creating channel:', error);
        res.status(500).json({ message: 'Server error creating channel' });
    }
};

exports.joinChannel = async (req, res) => {
    try {
        const { channelId } = req.params;
        const userId = req.userId;

        const channel = await Channel.findById(channelId);
        if (!channel) {
            return res.status(404).json({ message: 'Channel not found' });
        }

        if (channel.members.includes(userId)) {
            return res.status(400).json({ message: 'User already in channel' });
        }

        channel.members.push(userId);
        await channel.save();
        await channel.populate('members', 'username email');

        res.status(200).json(channel);
    } catch (error) {
        console.error('Error joining channel:', error);
        res.status(500).json({ message: 'Server error joining channel' });
    }
};

exports.leaveChannel = async (req, res) => {
    try {
        const { channelId } = req.params;
        const userId = req.userId;

        const channel = await Channel.findById(channelId);
        if (!channel) {
            return res.status(404).json({ message: 'Channel not found' });
        }

        channel.members = channel.members.filter(member => member.toString() !== userId);
        await channel.save();
        await channel.populate('members', 'username email');

        res.status(200).json(channel);
    } catch (error) {
        console.error('Error leaving channel:', error);
        res.status(500).json({ message: 'Server error leaving channel' });
    }
};
