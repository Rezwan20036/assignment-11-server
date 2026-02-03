const mongoose = require('mongoose');

const timelineSchema = new mongoose.Schema({
    status: String, // Pending, In-Progress, etc.
    message: String,
    updatedBy: {
        name: String,
        role: String,
        // optionally include ID
    },
    date: {
        type: Date,
        default: Date.now,
    }
});

const issueSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    category: String,
    status: {
        type: String,
        enum: ['Pending', 'In-Progress', 'Resolved', 'Closed'],
        default: 'Pending',
    },
    priority: {
        type: String,
        enum: ['Normal', 'High'],
        default: 'Normal',
    },
    location: String,
    images: [String],
    reporter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
    },
    upvotes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    timeline: [timelineSchema],
}, { timestamps: true });

// Check text index for search
issueSchema.index({ title: 'text', category: 'text', location: 'text' });

module.exports = mongoose.model('Issue', issueSchema);
