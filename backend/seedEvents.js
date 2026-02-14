const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const Event = require('./models/Event');

const seedEvents = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const eventsPath = path.join(__dirname, 'events.json');
        const eventsData = JSON.parse(fs.readFileSync(eventsPath, 'utf-8'));

        await Event.deleteMany({}); // Optional: Clear existing events
        console.log('Cleared existing events');

        // Transform data if necessary (e.g. date strings to Date objects) or just insert
        // Mongoose handles string->Date conversion usually.

        await Event.insertMany(eventsData);
        console.log(`Seeded ${eventsData.length} events successfully.`);

        process.exit();
    } catch (error) {
        console.error('Error seeding events:', error);
        process.exit(1);
    }
};

seedEvents();
