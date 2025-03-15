const express = require('express');
const pool = require('../config/db');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
require('dotenv').config();

const router = express.Router();

// Store verification codes temporarily
const verificationCodes = {};

// **Step 1: Get Email from Patient ID and Send Code**
router.post('/send-verification', async (req, res) => {
    const { PID } = req.body;
    console.log("Received Patient ID:", PID);
    if (!PID) {
        return res.status(400).json({ error: 'Patient ID is required' });
    }

    try {
        const [results] = await pool.query('SELECT email FROM patients WHERE patient_ID = ?', [PID]);
        
        if (results.length === 0) {
            return res.status(404).json({ error: 'Patient not found' });
        }
        console.log("Patient Email:", results[0].email);
        const email = results[0].email;
        const verificationCode = crypto.randomInt(100000, 999999).toString();
        verificationCodes[email] = verificationCode;
        console.log("Verification Code:", verificationCode);

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            },
            tls: {
                rejectUnauthorized: false // for the production version
            }
        });
        

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Verification Code to set up your account',
            text: `Please use this as the verification code to create your account: ${verificationCode}`
        };

        await transporter.sendMail(mailOptions);
        res.json({ message: 'Verification email sent successfully' });
        console.log("Verification email sent to:", email);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
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
router.post('/reset-password', async (req, res) => {
    const { patientId, password } = req.body;

    try {
        await pool.query('UPDATE patient_user SET password = ? WHERE patient_ID = ?', [password, patientId]);
        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ error: 'Database error' });
    }
});

module.exports = router;
