const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Club = require('./models/Club');
const Sponsor = require('./models/Sponsor');

const updateData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        // Update Clubs
        await Club.deleteMany({});
        const professionalClubs = [
            {
                name: 'IEEE Student Branch',
                logo: 'https://upload.wikimedia.org/wikipedia/commons/2/21/IEEE_logo.svg',
                description: 'World\'s largest technical professional organization.'
            },
            {
                name: 'ACM Student Chapter',
                logo: 'https://upload.wikimedia.org/wikipedia/en/8/8e/Association_for_Computing_Machinery_%28ACM%29_logo.svg',
                description: 'Advancing Computing as a Science & Profession.'
            },
            {
                name: 'GDSC',
                logo: 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Google_Developers_logo.svg',
                description: 'Google Developer Student Clubs.'
            },
            {
                name: 'Github Campus',
                logo: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png',
                description: 'Building developer communities on campus.'
            }
        ];
        await Club.insertMany(professionalClubs);
        console.log('Clubs updated.');

        // Update Sponsors
        await Sponsor.deleteMany({});
        const realSponsors = [
            {
                name: 'Google',
                logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg',
                tier: 'Title'
            },
            {
                name: 'Microsoft',
                logo: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg',
                tier: 'Gold'
            },
            {
                name: 'Amazon',
                logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
                tier: 'Gold'
            },
            {
                name: 'Intel',
                logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7d/Intel_logo_%282020%29.svg',
                tier: 'Silver'
            }
        ];
        await Sponsor.insertMany(realSponsors);
        console.log('Sponsors updated.');

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

updateData();
