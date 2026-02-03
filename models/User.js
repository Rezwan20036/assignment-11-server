const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    // We might store firebase uid if not syncing passwords
    password: {
        type: String,
        // required: true // Can be optional if only social login
    },
    photo: String,
    phone: String,
    role: {
        type: String,
        enum: ['admin', 'staff', 'citizen'],
        default: 'citizen',
    },
    isPremium: {
        type: Boolean,
        default: false,
    },
    isBlocked: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
