const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
    },
    rounds: {
        type: String, // E.g., "Round 1: MCQ, Round 2: Coding..."
    },
    category: {
        type: String,
        enum: ['Technical', 'Cultural', 'Sports', 'Workshop', 'Pro-Show', 'Ideathon', 'Paper Presentation', 'Project Presentation', 'Live-In Concert'],
        required: true,
    },
    eventType: {
        type: String, // 'Normal', 'Hackathon', 'Workshop', 'Hands-on', 'Ideathon', 'Paper Presentation', 'Project Presentation', 'OnStage', 'OffStage'
        default: 'Normal'
    },
    timings: {
        type: String, // E.g., "10:00 AM - 4:00 PM" (Legacy/Fallback)
    },
    fromTime: {
        type: String, // E.g., "10:00 AM"
    },
    toTime: {
        type: String, // E.g., "04:00 PM"
    },
    prize: {
        type: String, // E.g., "Winner: ₹5000, Runner: ₹3000"
    },
    winnerPrize: {
        type: String, // E.g., "₹5000"
    },
    runnerPrize: {
        type: String, // E.g., "₹3000"
    },
    rules: {
        type: String,
    },
    artistName: {
        type: String, // For Live-In Concert
    },
    pptTemplateUrl: {
        type: String,
    },
    club: {
        type: String, // E.g., "CSEA", "Dance Club"
        required: false, // Not required for Technical events
    },
    department: {
        type: String, // E.g., "CSE", "ECE"
    },
    date: {
        type: Date,
        required: true,
    },
    venue: {
        type: String,
        required: true,
    },
    image: {
        type: String, // URL to image
    },
    registrationFee: {
        type: Number,
        default: 0,
    },
    coordinators: [{
        name: String,
        phone: String,
    }],
    facultyCoordinators: [{
        name: String,
        phone: String,
    }],
    studentCoordinators: [{
        name: String,
        phone: String,
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        required: true,
    }
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
