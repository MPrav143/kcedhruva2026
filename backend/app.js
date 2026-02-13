const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: 'http://localhost:5173', // Vite default port
    credentials: true
}));
app.use(helmet({
    crossOriginResourcePolicy: false,
}));
app.use(morgan('dev'));
app.use(cookieParser());

// Routes
// Routes
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const registrationRoutes = require('./routes/registrationRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const passRoutes = require('./routes/passRoutes');
const dynamicContentRoutes = require('./routes/dynamicContentRoutes');
const path = require('path');

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/passes', passRoutes);
app.use('/api/content', dynamicContentRoutes);

// Make uploads folder static
app.use('/uploads', express.static(path.resolve(__dirname, 'uploads')));

app.get('/', (req, res) => {
    res.send('Secure DHRUVA 2025 API is running');
});

module.exports = app;
