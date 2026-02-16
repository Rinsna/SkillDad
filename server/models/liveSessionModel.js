const mongoose = require('mongoose');

const liveSessionSchema = mongoose.Schema({
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    title: { type: String, required: true },
    scheduledAt: { type: Date, required: true },
    duration: { type: Number, required: true }, // in minutes
    meetingLink: { type: String, required: true },
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, {
    timestamps: true,
});

const LiveSession = mongoose.model('LiveSession', liveSessionSchema);

module.exports = LiveSession;
