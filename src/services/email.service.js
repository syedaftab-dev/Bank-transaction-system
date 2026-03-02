require('dotenv').config();
const nodemailer = require('nodemailer');

// Create a transporter using Gmail and OAuth2 authentication, used for sending emails in the application (e.g., password reset, notifications) uses smtp protocol to send email from the application to the user's email address. It is configured to use Gmail's SMTP server with OAuth2 authentication for secure email sending. The transporter is then exported for use in other parts of the application where email functionality is needed.
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Error connecting to email server:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});

// Function to send email
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Bank System (Aftab)" <${process.env.EMAIL_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

async function sendRegistrationEmail(userEmail, name) {
  const subject = "Welcome to Bank System!";
  const text = `Welcome to Bank System, ${name}! We're excited to have you on board.`;
  const html = `
    <h1>Welcome to Bank System, ${name}!</h1>
    <p>We're excited to have you on board.</p>
  `;
  await sendEmail(userEmail, subject, text, html);
}

module.exports = { sendEmail, sendRegistrationEmail };