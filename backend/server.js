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

// Start server if run directly (Local Development)
if (require.main === module) {
    connectDatabase().then(() => {
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    });
}
