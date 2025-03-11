const nodemailer = require("nodemailer");
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "your-email@gmail.com", 
        pass: "your-app-password",
    },
});

// Email options
const mailOptions = {
    from: '"Your Name" <your-email@gmail.com>',
    to: "recipient@example.com",
    subject: "Test Email from Nodemailer",
    text: "Hello, this is a test email from Nodemailer!",
    html: "<b>Hello, this is a test email from Nodemailer!</b>",
};

// Send email
transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        console.error("Error sending email:", error);
    } else {
        console.log("Email sent:", info.response);
    }
});
