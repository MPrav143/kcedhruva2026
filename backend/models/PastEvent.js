const mongoose = require('mongoose');

const pastEventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: false,
    },
    image: {
        type: String, // URL
        required: true,
    },
    youtubeLink: {
        type: String // Optional: YouTube link
    }
}, { timestamps: true });

module.exports = mongoose.model('PastEvent', pastEventSchema);
