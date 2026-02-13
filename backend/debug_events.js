const axios = require('axios');

async function checkEvents() {
    try {
        const response = await axios.get('http://localhost:5000/api/events');
        const events = response.data;

        console.log('Total Events:', events.length);
        console.log('--- Cultural Events ---');
        events.filter(e => e.category === 'Cultural').forEach(e => {
            console.log(`Title: ${e.title}, Category: ${e.category}, EventType: '${e.eventType}', Department: '${e.department}'`);
        });
    } catch (error) {
        console.error('Error fetching events:', error.message);
    }
}

checkEvents();
