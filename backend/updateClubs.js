const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Club = require('./models/Club');

const updateClubs = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        // Clear existing clubs
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
                name: 'Google Developer Groups',
                logo: 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Google_Developers_logo.svg',
                description: 'Building communities for developers.'
            },
            {
                name: 'CSI Student Branch',
                logo: 'https://www.csi-india.org/images/logo.png',
                description: 'Computer Society of India.'
            },
            {
                name: 'Github Campus Expert',
                logo: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png',
                description: 'Building developer communities on campus.'
            }
        ];

        await Club.insertMany(professionalClubs);
        console.log('Clubs updated successfully with professional logos');
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

updateClubs();
