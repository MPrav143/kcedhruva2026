const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const Club = require('./models/Club');

const checkClubs = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const clubs = await Club.find({});
        console.log(JSON.stringify(clubs, null, 2));
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

checkClubs();
