const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    transactionId: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ['subscription', 'boost'],
        required: true,
    },
    issueId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Issue', // Only for 'boost' type
    }
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
