import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Email transporter setup (using Gmail)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, number, project_type, message } = req.body;

    // Validation
    if (!name || !email || !number || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required fields: name, email, phone number, and message.'
      });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address.'
      });
    }

    // Email to Yash (recipient)
    const mailToYash = {
      from: process.env.EMAIL_USER,
      to: process.env.RECIPIENT_EMAIL || 'yashaakole6@gmail.com',
      subject: `New Portfolio Inquiry from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">New Contact Form Submission</h2>
          <hr style="border: none; border-top: 2px solid #eee; margin: 20px 0;">
          
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone/WhatsApp:</strong> ${number}</p>
            <p><strong>Project Type:</strong> ${project_type || 'Not specified'}</p>
          </div>

          <div>
            <h3 style="color: #333;">Message:</h3>
            <p style="color: #555; line-height: 1.6; white-space: pre-wrap;">${message}</p>
          </div>

          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #999; font-size: 12px;">This email was sent from your portfolio contact form.</p>
        </div>
      `
    };

    // Confirmation email to client
    const mailToClient = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Thank you for contacting Yash Akole',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Thank You, ${name}!</h2>
          <p>Your message has been received successfully. I'll get back to you as soon as possible.</p>
          
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Your Message Summary:</strong></p>
            <p><strong>Phone:</strong> ${number}</p>
            <p><strong>Project Type:</strong> ${project_type || 'Not specified'}</p>
            <p style="color: #555; line-height: 1.6; white-space: pre-wrap;">${message}</p>
          </div>

          <p>Feel free to connect with me on:</p>
          <ul style="color: #555;">
            <li>WhatsApp: <strong>+91 9340898220</strong></li>
            <li>Email: <strong>yashaakole6@gmail.com</strong></li>
          </ul>

          <p style="color: #999; font-size: 12px; margin-top: 30px;">Best regards,<br><strong>Yash Akole</strong> — Video Editor & Content Strategist</p>
        </div>
      `
    };

    // Send both emails
    await transporter.sendMail(mailToYash);
    await transporter.sendMail(mailToClient);

    res.json({
      success: true,
      message: 'Message sent successfully! Check your email for confirmation.'
    });

  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message. Please try again later.'
    });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`\n✓ Server running on http://localhost:${PORT}`);
  console.log(`✓ Serving files from: ${__dirname}`);
  console.log(`✓ Email service: ${process.env.EMAIL_USER ? 'Configured ✓' : 'NOT CONFIGURED ✗'}\n`);
});
