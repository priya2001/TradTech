import nodemailer from 'nodemailer';
import { sender } from './nodemailer.config.js';

const sendEmail = async (options) => {
  try {
    // Validate required fields
    if (!options?.email) throw new Error('Recipient email is required');
    if (!options.subject) throw new Error('Email subject is required');
    if (!options.message) throw new Error('Email message is required');

    // 1) Create transporter
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || "Gmail",
      auth: {
        user: sender.email,
        pass: process.env.EMAIL_PASSWORD,
      },
      ...(process.env.NODE_ENV !== 'production' && {
        tls: { rejectUnauthorized: false },
        logger: true // Enable logging in development
      })
    });

    // 2) Define email options
    const mailOptions = {
      from: `"${sender.name}" <${sender.email}>`,
      to: options.email, // Directly use email from options
      subject: options.subject,
      html: options.message,
      text: options.text || options.message.replace(/<[^>]+>/g, '') // Use provided text or generate
    };

    // 3) Send email
    const info = await transporter.sendMail(mailOptions);
    // console.log(`Email sent to ${options.email}`, {
    //   messageId: info.messageId,
    //   subject: options.subject
    // });
    // console.log(info);
    return info;
  } catch (error) {
    console.error('Email sending failed:', {
      error: error.message,
      recipient: options?.email,
      subject: options?.subject
    });
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

export default sendEmail;