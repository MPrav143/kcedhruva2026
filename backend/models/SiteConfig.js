const mongoose = require('mongoose');

const siteConfigSchema = new mongoose.Schema({
    key: {
        type: String,
        required: true,
        unique: true, // e.g., 'home_hero_bg', 'navbar_logo'
    },
    value: {
        type: String, // URL or text content
        required: true,
    },
    type: {
        type: String,
        enum: ['image', 'text'],
        default: 'image'
    }
}, { timestamps: true });

module.exports = mongoose.model('SiteConfig', siteConfigSchema);
