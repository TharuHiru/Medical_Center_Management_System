const express = require('express');
const db = require('../config/db');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
require('dotenv').config();

const router = express.Router();

// Store verification codes temporarily
const verificationCodes = {};

// **Step 1: Get Email from Patient ID and Send Code**
router.post('/send-verification', (req, res) => {
    const { PID } = req.body;

    if (!PID) {
        console.error("Patient ID is missing from request body");
        return res.status(400).json({ error: 'Patient ID is required' });
    }

    db.query('SELECT email FROM patients WHERE patient_ID = ?', [PID], (err, results) => {
        if (err) {
            console.error("Database query error:", err);
            return res.status(500).json({ error: 'Database error' });
        }
        
        if (results.length === 0) {
            console.error(`No patient found with ID: ${PID}`);
            return res.status(404).json({ error: 'Patient not found' });
        }

        const email = results[0].email;
        const verificationCode = crypto.randomInt(100000, 999999).toString(); // Generate 6-digit code

        // Store the code temporarily
        verificationCodes[email] = verificationCode;
        console.log(`Generated verification code ${verificationCode} for email: ${email}`);

        // Setup email transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        // Email content
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Verification Code to set up your account',
            text: `Please use this as the verification code to create your account: ${verificationCode}`
        };

        // Send Email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Email sending error:", error);
                return res.status(500).json({ error: 'Email sending failed' });
            }
            
            console.log(`Verification email sent to ${email}: ${info.response}`);
            res.json({ message: 'Verification email sent successfully' });
        });
    });
});

// **Step 2: Verify Code**
router.post('/verify-code', (req, res) => {
    const { email, code } = req.body;

    if (verificationCodes[email] === code) {
        res.json({ message: 'Code verified successfully' });
    } else {
        res.status(400).json({ error: 'Invalid verification code' });
    }
});

// **Step 3: Reset Password**
router.post('/reset-password', (req, res) => {
    const { patientId, password } = req.body;

    db.query('UPDATE patient_user SET password = ? WHERE patient_ID = ?', [password, patientId], (err, result) => {
        if (err) return res.status(500).json({ error: 'Database error' });

        delete verificationCodes[email]; // Remove used code
        res.json({ message: 'Password updated successfully' });
    });
});

module.exports = router;
