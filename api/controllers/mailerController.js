const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PSW,
    },
});

const sendActivationEmail = (userEmail, activationToken) => {
    const activationLink = `http://${process.env.SERVER}:${process.env.PORT}/auth/activate?key=${activationToken}`;
    const mailOptions = {
        from: `"MedAccess" <${process.env.EMAIL}>`,
        to: userEmail,
        subject: "Activate Your Account",
        html: `
            <h2>Welcome to MedAccess!</h2>
            <p>Click the link below to activate your account:</p>
            <a href="${activationLink}" target="_blank">
                Activate Account
            </a>
            <p>If you didn’t sign up for this account, please ignore this email.</p>
        `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Error sending email:", error);
        } else {
            console.log(`Activation email sent to ${userEmail}:`, info.response);
        }
    });
};

module.exports = { sendActivationEmail };

const sendPasswordRecoverEmail = (userEmail, resetToken) => {
    const resetLink = `http://${process.env.SERVER}:${process.env.PORT}/auth/reset-password?key=${resetToken}`;
    
    const mailOptions = {
        from: `"MedAccess" <${process.env.EMAIL}>`,
        to: userEmail,
        subject: "Reset Your Password",
        html: `
            <h2>Password Reset Request</h2>
            <p>Click the link below to reset your password:</p>
            <a href="${resetLink}" target="_blank">
                Reset Password
            </a>
            <p>This link will expire in 1 hour.</p>
        `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Error sending email:", error);
        } else {
            console.log(`Password recovery email sent to ${userEmail}:`, info.response);
        }
    });
};

module.exports = { sendPasswordRecoverEmail };