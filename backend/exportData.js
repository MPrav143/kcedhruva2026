const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');

dotenv.config();

const Club = require('./models/Club');
const Sponsor = require('./models/Sponsor');

const exportData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const clubs = await Club.find({});
        const sponsors = await Sponsor.find({});

        const data = { clubs, sponsors };
        fs.writeFileSync('db_export.json', JSON.stringify(data, null, 2), 'utf8');
        console.log('Export successful');
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

exportData();
