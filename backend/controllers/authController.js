const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Event = require('../models/Event');
const Registration = require('../models/Registration');
const Pass = require('../models/Pass');

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '1d',
    });
};

// @desc    Auth Admin & Get Token
// @route   POST /api/auth/login
// @access  Public
const loginAdmin = async (req, res) => {
    const { username, password } = req.body;

    try {
        // 1. Standard DB Login
        const admin = await Admin.findOne({ username });

        if (admin && (await admin.comparePassword(password))) {
            const token = generateToken(admin._id);

            // Send token in HTTP-only cookie
            res.cookie('jwt', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV !== 'development', // Use secure cookies in production
                sameSite: 'strict',
                maxAge: 24 * 60 * 60 * 1000, // 1 day
            });

            res.json({
                _id: admin._id,
                username: admin.username,
                role: admin.role,
                department: admin.department,
                token: token, // Also sending token in body for flexibility
            });
        } else {
            res.status(401).json({ message: 'Invalid username or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Logout Admin / Clear Cookie
// @route   POST /api/auth/logout
// @access  Public
const logoutAdmin = (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0),
    });
    res.status(200).json({ message: 'Logged out successfully' });
};

// @desc    Create Initial Admin (Setup)
// @route   POST /api/auth/setup
// @access  Public (Should be disabled after setup)
const setupAdmin = async (req, res) => {
    const { username, password, role, department } = req.body;

    try {
        const adminExists = await Admin.findOne({ username });

        if (adminExists) {
            return res.status(400).json({ message: 'Admin already exists' });
        }

        const admin = await Admin.create({
            username,
            password,
            role: role || 'superadmin',
            department
        });

        if (admin) {
            res.status(201).json({
                _id: admin._id,
                username: admin.username,
                role: admin.role,
            });
        } else {
            res.status(400).json({ message: 'Invalid admin data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get Dashboard Statistics
// @route   GET /api/auth/stats
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
    try {
        const { role, department } = req.admin;

        let stats = {};

        if (role === 'principal' || role === 'dean') {
            // Principal/Dean Dashboard Stats
            const totalEvents = await Event.countDocuments();
            const totalRegistrations = await Registration.countDocuments({ paymentStatus: 'Completed' });

            // Revenue by Department
            // We need to aggregate registrations -> events -> department
            // This is complex because Registration -> Pass -> Event(s) is not direct.
            // Registration has `eventId`? No, Registration is for Pass usually?
            // Wait, previous code:
            // const revenueData = await Registration.aggregate([ ... ]);

            // Let's look at Registration model to be sure.
            // Assuming Registration has paymentStatus and amount.
            // To get department-wise stats, we need to know which department "owns" the registration money.
            // If it's a pass, it covers multiple events.
            // If it's single event registration (if supported).

            // Re-reading requirements: "how much amount is revenued etc..."
            // For now, let's give total revenue and breakdown by event if possible.

            const revenueData = await Registration.aggregate([
                { $match: { paymentStatus: 'Completed' } },
                {
                    $project: {
                        amountVal: {
                            $convert: {
                                input: { $arrayElemAt: [{ $split: ["$amount", "/"] }, 0] },
                                to: "double",
                                onError: 0,
                                onNull: 0
                            }
                        }
                    }
                },
                { $group: { _id: null, total: { $sum: '$amountVal' } } }
            ]);
            const totalRevenue = revenueData.length > 0 ? revenueData[0].total : 0;

            const departmentStats = await Event.aggregate([
                {
                    $group: {
                        _id: "$department",
                        count: { $sum: 1 }
                    }
                }
            ]);

            // Chart Data: Registrations by Department (Student's Department)
            const registrationPieData = await Registration.aggregate([
                { $match: { paymentStatus: 'Completed' } },
                { $group: { _id: "$department", value: { $sum: 1 } } }
            ]);

            // Chart Data: Events by Category
            const eventsPieData = await Event.aggregate([
                { $group: { _id: "$category", value: { $sum: 1 } } }
            ]);

            // Chart Data: Revenue by Department (Approximate based on student dept)
            // Or better, registrations count by student dept (Bar Chart)

            stats = {
                totalEvents,
                totalRegistrations,
                totalRevenue,
                departmentStats,
                registrationPieData,
                eventsPieData
            };
        } else if (role === 'hod') {
            // HOD Dashboard Stats
            // Events organized by their department
            if (!department) {
                return res.status(400).json({ message: "HOD must have a department assigned." });
            }

            // Case-insensitive match for department often needed if data is inconsistent
            // But let's assume consistency for now or use regex
            const events = await Event.find({ department: { $regex: new RegExp(`^${department}$`, 'i') } });

            // To get total participants for these events
            // We need to find registrations that have these events
            const eventIds = events.map(e => e._id);

            const registrations = await Registration.find({
                paymentStatus: 'Completed',
                events: { $in: eventIds }
            }).populate('pass'); // Populate if needed

            // Chart Data: Year wise distribution of participants
            const yearDistribution = await Registration.aggregate([
                { $match: { paymentStatus: 'Completed', events: { $in: eventIds } } },
                { $group: { _id: "$year", value: { $sum: 1 } } }
            ]);

            stats = {
                events,
                totalEvents: events.length,
                totalParticipants: registrations.length,
                yearDistribution
            };
        } else {
            // Admin/Dhruva Team (Standard)
            const totalEvents = await Event.countDocuments();
            const totalRegistrations = await Registration.countDocuments({ paymentStatus: 'Completed' });
            const totalPasses = await Pass.countDocuments({ isActive: true });

            // Sum revenue from completed registrations
            const revenueData = await Registration.aggregate([
                { $match: { paymentStatus: 'Completed' } },
                {
                    $project: {
                        amountVal: {
                            $convert: {
                                input: { $arrayElemAt: [{ $split: ["$amount", "/"] }, 0] },
                                to: "double",
                                onError: 0,
                                onNull: 0
                            }
                        }
                    }
                },
                { $group: { _id: null, total: { $sum: '$amountVal' } } }
            ]);
            const totalRevenue = revenueData.length > 0 ? revenueData[0].total : 0;

            // Recent Activity
            const recentRegistrations = await Registration.find({ paymentStatus: 'Completed' })
                .sort({ createdAt: -1 })
                .limit(5)
                .populate('pass');

            // Chart Data for Admin:
            const registrationTrends = await Registration.aggregate([
                { $match: { paymentStatus: 'Completed' } },
                { $group: { _id: "$department", value: { $sum: 1 } } }
            ]);

            stats = {
                totalEvents,
                totalRegistrations,
                totalPasses,
                totalRevenue,
                recentRegistrations,
                registrationTrends
            };
        }

        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    loginAdmin,
    logoutAdmin,
    setupAdmin,
    getDashboardStats
};
