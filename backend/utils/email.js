const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail', // or your email provider
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

/**
 * Send registration confirmation email
 * @param {Object} registration - The registration document
 * @param {Object} pass - The pass details
 */
const sendRegistrationEmail = async (registration, pass, events) => {

    // Color mapping to match frontend gradients/themes
    const colorMap = {
        blue: {
            bg: 'linear-gradient(135deg, #1e3a8a, #1e40af)', // Blue 900 to Blue 800
            border: '#3b82f6', // Blue 500
            text: '#60a5fa', // Blue 400
            shadow: 'rgba(59, 130, 246, 0.3)'
        },
        red: {
            bg: 'linear-gradient(135deg, #7f1d1d, #991b1b)',
            border: '#ef4444',
            text: '#f87171',
            shadow: 'rgba(239, 68, 68, 0.3)'
        },
        green: {
            bg: 'linear-gradient(135deg, #14532d, #166534)',
            border: '#22c55e',
            text: '#4ade80',
            shadow: 'rgba(34, 197, 94, 0.3)'
        },
        purple: {
            bg: 'linear-gradient(135deg, #581c87, #6b21a8)',
            border: '#a855f7',
            text: '#c084fc',
            shadow: 'rgba(168, 85, 247, 0.3)'
        },
        yellow: {
            bg: 'linear-gradient(135deg, #713f12, #854d0e)',
            border: '#eab308',
            text: '#facc15',
            shadow: 'rgba(234, 179, 8, 0.3)'
        },
        pink: {
            bg: 'linear-gradient(135deg, #831843, #9d174d)',
            border: '#ec4899',
            text: '#f472b6',
            shadow: 'rgba(236, 72, 153, 0.3)'
        }
    };

    const theme = colorMap[pass.color] || colorMap.blue;

    // List of registered events
    const eventListHtml = events && events.length > 0
        ? events.map(e => `<li style="margin-bottom: 5px;"><strong>${e.title}</strong> <span style="font-size: 0.8em; color: #ccc;">(${e.category})</span></li>`).join('')
        : '<li>No specific events selected (General Access)</li>';

    const mailOptions = {
        from: `"Dhruva Team" <${process.env.EMAIL_USER}>`,
        to: registration.email,
        subject: `Registration Confirmed - ${pass.name}`,
        html: `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0a0a0a; color: #fff; padding: 40px 20px;">
                <div style="max-width: 600px; margin: auto; background-color: #1a1a1a; border-radius: 20px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); overflow: hidden;">
                    
                    <!-- Header -->
                    <div style="text-align: center; padding: 30px; background: linear-gradient(to right, #000000, #1a1a1a); border-bottom: 1px solid #333;">
                        <h1 style="margin: 0; color: #fff; font-size: 28px; letter-spacing: 2px;">DHRUVA 2025</h1>
                        <p style="color: #888; margin: 10px 0 0;">Outshine. Outperform. Outlast.</p>
                    </div>

                    <!-- Pass Design -->
                    <div style="padding: 30px;">
                        <div style="
                            background: ${theme.bg}; 
                            border: 2px solid ${theme.border};
                            border-radius: 20px;
                            padding: 30px;
                            position: relative;
                            box-shadow: 0 0 20px ${theme.shadow};
                            color: #fff;
                        ">
                            <!-- Popular Tag (if yellow) -->
                            ${pass.color === 'yellow' ? '<div style="position: absolute; top: 0; right: 0; background: #eab308; color: #000; font-size: 10px; font-weight: bold; padding: 5px 15px; border-bottom-left-radius: 15px; border-top-right-radius: 15px;">POPULAR</div>' : ''}

                            <h2 style="margin: 0 0 10px; font-size: 24px;">${pass.name}</h2>
                            <div style="font-size: 32px; font-weight: bold; color: ${theme.text}; margin-bottom: 20px;">
                                ₹${pass.price} <span style="font-size: 14px; color: rgba(255,255,255,0.7); font-weight: normal;">/person</span>
                            </div>
                            
                            <div style="background: rgba(0,0,0,0.2); border-radius: 10px; padding: 15px; margin-bottom: 20px;">
                                <table style="width: 100%; border-collapse: collapse; color: #ddd; font-size: 14px;">
                                    <tr>
                                        <td style="padding: 5px 0; color: rgba(255,255,255,0.6);">Name:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right;">${registration.studentName}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: rgba(255,255,255,0.6);">Roll Number:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right;">${registration.rollNumber}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: rgba(255,255,255,0.6);">Department:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right;">${registration.department}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: rgba(255,255,255,0.6);">Year:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right;">${registration.year}</td>
                                    </tr>
                                     <tr>
                                        <td style="padding: 5px 0; color: rgba(255,255,255,0.6);">Mobile:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right;">${registration.phone}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: rgba(255,255,255,0.6);">Pass ID (Ticket):</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right; font-family: monospace; color: ${theme.text}; font-size: 16px;">${registration.ticketId || registration._id}</td>
                                    </tr>
                                </table>
                            </div>

                            <p style="font-size: 13px; color: rgba(255,255,255,0.8); line-height: 1.5; margin: 0;">
                                ${pass.description}
                            </p>
                        </div>

                        <!-- Registered Events -->
                        <div style="margin-top: 30px;">
                            <h3 style="color: ${theme.text}; border-bottom: 1px solid #333; padding-bottom: 10px;">Registered Events</h3>
                            <ul style="color: #ccc; padding-left: 20px; line-height: 1.6;">
                                ${eventListHtml}
                            </ul>
                        </div>
                    </div>

                    <!-- Footer -->
                    <div style="text-align: center; padding: 20px; background-color: #111; border-top: 1px solid #333; color: #666; font-size: 12px;">
                        <p>This is a system generated email. Please present this at the registration desk.</p>
                        <p>&copy; 2025 Dhruva Organizing Team</p>
                    </div>
                </div>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Registration email sent to ${registration.email}`);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
};

module.exports = {
    sendRegistrationEmail
};
