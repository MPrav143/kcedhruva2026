require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    process.exit(1);
});

// Connect to Database
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        try {
            const PassModel = require('./models/Pass');
            console.log('DEBUG: Pass Schema Price Type:', PassModel.schema.paths.price.instance);
        } catch (e) {
            console.log('DEBUG: Error checking Pass schema:', e.message);
        }
    });
});


// Handle unhandled rejections
process.on('unhandledRejection', (err) => {
    console.log('UNHANDLED REJECTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    process.exit(1);
});
