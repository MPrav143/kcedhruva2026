const mongoose = require('mongoose');

const passSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: String,
        required: true
    },
    type: {
        type: String,
        default: 'Individual'
    },
    perks: [{
        type: String
    }],
    color: {
        type: String,
        default: 'blue'
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

if (mongoose.models.Pass) {
    delete mongoose.models.Pass;
}

module.exports = mongoose.model('Pass', passSchema);
