const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
    pass: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pass',
        required: true
    },
    events: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'
    }],
    studentName: {
        type: String,
        required: true,
    },
    rollNumber: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    department: {
        type: String,
        required: true,
    },
    year: {
        type: String, // 1st, 2nd, 3rd, 4th
    },
    paymentId: {
        type: String,
    },
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Completed', 'Failed'],
        default: 'Pending',
    },
    amount: {
        type: String, // Changed to String to support "500/1000" format
        required: true,
    },
    ticketId: {
        type: String,
        unique: true,
    }
}, { timestamps: true });

module.exports = mongoose.model('Registration', registrationSchema);
