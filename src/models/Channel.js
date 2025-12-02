const mongoose = require("mongoose");
const { Schema, Types } = mongoose;

const messageSchema = new Schema({
    sender: {
        type:Types.ObjectId,
        ref: "User",
        required: true,
    },
    channel: {
        type: Types.ObjectId,
        ref: "Channel",
        required: true,
    },
    content: {
        type: String,
        required: true,
        trim: true,
    },

    editedAt: {
        type: Date,
        default: null,
    },

    deletedAt: {
        type: Date,
        default: null,
    },

}, { timestamps: true });

messageSchema.index({ channel: 1, createdAt: -1 });

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
