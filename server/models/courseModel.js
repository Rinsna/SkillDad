const mongoose = require('mongoose');

const exerciseSchema = mongoose.Schema({
    question: { type: String, required: true },
    options: [{ type: String }],
    correctAnswer: { type: String, required: true },
    type: { type: String, enum: ['mcq', 'short-answer'], default: 'mcq' },
});

const videoSchema = mongoose.Schema({
    title: { type: String, required: true },
    url: { type: String, required: true }, // Embed URL
    duration: { type: String }, // e.g., "10:05"
    exercises: [exerciseSchema], // Mandatory exercises after video
});

const moduleSchema = mongoose.Schema({
    title: { type: String, required: true },
    videos: [videoSchema],
});

const courseSchema = mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    thumbnail: { type: String }, // URL
    category: { type: String, required: true },
    price: { type: Number, required: true, default: 0 },
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    modules: [moduleSchema],
    projects: [{
        title: String,
        description: String,
        deadline: Date,
    }],
    isPublished: { type: Boolean, default: false },
}, {
    timestamps: true,
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
