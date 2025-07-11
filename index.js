const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Brevo SMTP Transporter Setup
const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false, // true for port 465
  auth: {
    user: '91ce3a001@smtp-brevo.com', // your Brevo SMTP login
    pass: 'gUGqc1JmTIYhPCVv'       // your Brevo SMTP password (API key)
  }
});

// Contact form route
app.post('/contact', (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  const mailOptions = {
    from: 'hello@thegohra.com', // verified sender email in Brevo
    to: 'hello@thegohra.com',   // or wherever you want to receive
    subject: `New Contact Form Message: ${subject}`,
    html: `
      <h3>New message from contact form</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong><br/>${message}</p>
    `
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error('❌ Error sending email:', err);
      res.status(500).json({ success: false, message: 'Email not sent' });
    } else {
      console.log('✅ Email sent:', info.response);
      res.json({ success: true, message: 'Email sent successfully' });
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
