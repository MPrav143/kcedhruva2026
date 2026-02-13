require('dotenv').config();
const mongoose = require('mongoose');
const Event = require('./models/Event');
const Admin = require('./models/Admin');

const run = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/dhruva2025');
        console.log('Connected to DB');

        const admin = await Admin.findOne();
        if (!admin) {
            console.log('No admin found. Creating dummy admin for test? No, safer to fail.');
            // Try to create one if none exists? 
            // Better to just list events if I can't create one easily.
            console.log('Cannot create event without admin. Listing existing events to check schema.');
            const event = await Event.findOne();
            if (event) {
                console.log('Existing event:', event);
            }
            process.exit(0);
        }

        const newEvent = new Event({
            title: 'Test Time Event ' + Date.now(),
            description: 'Testing fromTime and toTime',
            category: 'Technical',
            eventType: 'Normal',
            date: new Date(),
            venue: 'Test Venue',
            fromTime: '09:30 AM',
            toTime: '05:30 PM',
            createdBy: admin._id,
            timings: 'Legacy Timing String'
        });

        const saved = await newEvent.save();
        console.log('Saved Event ID:', saved._id);
        console.log('Saved Event fromTime:', saved.fromTime);
        console.log('Saved Event toTime:', saved.toTime);

        // Clean up
        await Event.findByIdAndDelete(saved._id);
        console.log('Cleaned up test event');

        process.exit(0);

    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

run();
