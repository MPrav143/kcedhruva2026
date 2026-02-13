const mongoose = require('mongoose');

const sponsorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    logo: {
        type: String, // URL
        required: true,
    },
    tier: {
        type: String, // e.g., 'Title', 'Gold', 'Silver'
        default: 'Silver'
    },
    website: {
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model('Sponsor', sponsorSchema);
