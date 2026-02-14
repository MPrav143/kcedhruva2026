const mongoose = require('mongoose');
require('dotenv').config();
const Event = require('./models/Event');

const eventId = '698f6af774c0625993f7fbb9';

const checkEvent = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        if (mongoose.Types.ObjectId.isValid(eventId)) {
            const event = await Event.findById(eventId);
            if (event) {
                console.log('Event found:', event.title);
            } else {
                console.log('Event NOT found with ID:', eventId);
            }
        } else {
            console.log('Invalid ObjectId format:', eventId);
        }

        const allEvents = await Event.find({}, '_id title');
        console.log('Available Events:', allEvents);

        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

checkEvent();
