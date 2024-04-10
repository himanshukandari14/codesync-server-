// Import the Nodemailer module
const nodemailer = require('nodemailer');
require('dotenv').config();
// Create a transporter object using SMTP transport
let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.USER_MAIL,  // Your email address
        pass: process.env.USER_PASS,    // Your email password
    },
    tls: {
        rejectUnauthorized: false
    }
});


// Create a function to send an email
const sendEmail = (to, subject, text) => {
    // Define email options
    let mailOptions = {
        from: 'code sync', // Sender address
        to: to,                        // Recipient address
        subject: subject,              // Email subject
        text: text,                  // Email body
        html: `<h3>${text}</h3>`
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error occurred:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
};

// Export the sendEmail function for use in other modules
module.exports = sendEmail;
