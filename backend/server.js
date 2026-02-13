require('dotenv').config();

const app = require('./app');
const connectDB = require('./config/db');

let isConnected = false;

// Connect to database (only once per cold start)
const connectDatabase = async () => {
    if (!isConnected) {
        try {
            await connectDB();
            isConnected = true;
            console.log('MongoDB connected');
        } catch (error) {
            console.error('Database connection failed:', error);
            throw error;
        }
    }
};

// Export serverless function
module.exports = async (req, res) => {
    await connectDatabase();
    return app(req, res);
};
