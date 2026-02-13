const Razorpay = require('razorpay');
const crypto = require('crypto');
const Registration = require('../models/Registration');
const axios = require('axios');
const { sendRegistrationEmail } = require('../utils/email');
const Pass = require('../models/Pass');

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'secret_placeholder',
});

// @desc    Create Razorpay Order
// @route   POST /api/payment/order
// @access  Public
const createOrder = async (req, res) => {
    try {
        const { amount, currency = 'INR', receipt } = req.body;

        const options = {
            amount: (parseFloat(amount.toString().split('/')[0]) || 0) * 100, // Amount in paise, handling "500/1000"
            currency,
            receipt,
        };

        const order = await razorpay.orders.create(options);
        res.json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Verify Payment
// @route   POST /api/payment/verify
// @access  Public
const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, registrationId } = req.body;

        const body = razorpay_order_id + '|' + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'secret_placeholder')
            .update(body.toString())
            .digest('hex');

        const isAuthentic = expectedSignature === razorpay_signature;

        if (isAuthentic) {
            // Update Registration Status
            const registration = await Registration.findById(registrationId).populate('pass').populate('events');
            if (registration) {
                registration.paymentStatus = 'Completed';
                registration.paymentId = razorpay_payment_id;
                await registration.save();

                // Send Confirmation Email
                await sendRegistrationEmail(registration, registration.pass, registration.events);

                // Trigger n8n Webhook for Automated Email/Reports
                const n8nUrl = process.env.N8N_WEBHOOK_URL_CONFIRMATION;
                if (n8nUrl) {
                    axios.post(n8nUrl, {
                        registration,
                        event: registration.event,
                        type: 'PAYMENT_SUCCESS'
                    }).catch(err => console.error('n8n trigger failed', err.message));
                }
            }

            res.json({ message: 'Payment verified successfully' });
        } else {
            res.status(400).json({ message: 'Invalid payment signature' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createOrder,
    verifyPayment,
};
