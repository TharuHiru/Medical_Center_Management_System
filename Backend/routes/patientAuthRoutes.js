const express = require('express');
const pool = require('../config/db');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
require('dotenv').config();
const bcrypt = require('bcryptjs');
const saltRounds = 10; // Define salt rounds for hashing

const router = express.Router();

// Global in-memory storage for verification codes
const verificationCode = {};

// Step 1: Send Verification Code
router.post('/send-verification', async (req, res) => {
    const { PID } = req.body;
    console.log("Received Patient ID:", PID);

    // Check if the Patient ID is provided
    if (!PID) {
        return res.status(400).json({ error: 'Patient ID is required' });
    }

    try {
        // Check if the patient already has an account
        const [existingUser] = await pool.query('SELECT * FROM patient_user WHERE patient_ID = ?', [PID]);

        if (existingUser.length > 0) {
            return res.status(400).json({ error: 'An account with this Patient ID already exists' });
        }
        
        // Fetch patient email from the database
        const [results] = await pool.query('SELECT email FROM patients WHERE patient_ID = ?', [PID]);

        if (results.length === 0) {
            return res.status(404).json({ error: 'Patient not found' });
        }

        const email = results[0].email;
        console.log("Patient Email:", email);

        // Generate a random verification code
        const verificationCodeValue = crypto.randomInt(100000, 999999).toString();

        // Save email and patientId in the temporary memory
        verificationCode[email] = {
            code: verificationCodeValue,
            patientId: PID // Store patientId alongside the verification code
        };
        console.log("Verification Code:", verificationCodeValue);

        // Setup email transporter using Gmail
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            },
            tls: {
                rejectUnauthorized: false // For production, avoid this in sensitive settings
            }
        });

        // Email options
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Verification Code to Set Up Your Account',
            text: `Please use this verification code to create your account: ${verificationCodeValue}`
        };

        // Send the verification email
        await transporter.sendMail(mailOptions);
        console.log("Verification email sent to:", email);

        // Respond with success message
        res.json({ message: 'Verification email sent successfully' });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/verify-code', (req, res) => {
    const { fullcode } = req.body;
    console.log("Received Verification Code:", fullcode);

    // Find the email corresponding to the verification code
    const email = Object.keys(verificationCode).find(email => verificationCode[email].code === fullcode.toString());

    if (email) {
        return res.json({ success: true, message: "Code verified successfully" });
    } else {
        return res.status(400).json({ success: false, error: "Invalid verification code" });
    }
});


// Step 3: Create Account (Set Password)
router.post('/set-password', async (req, res) => {
    const { password ,userName} = req.body;
    console.log("Received Password Details:", req.body);
    
    if (!password) {
        return res.status(400).json({ error: 'Password is required' });
    }

    try {
        // Retrieve the email from verificationCode (the first key)
        const email = Object.keys(verificationCode)[0];
        
        if (!email || !verificationCode[email]) {
            return res.status(400).json({ error: 'No verification code found or expired' });
        }

        // Get patientId stored alongside the code
        const patientId = verificationCode[email].patientId;
        if (!patientId) {
            return res.status(400).json({ error: 'Verification code has expired' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Insert patientId and hashed password into the database
        await pool.query(
            'INSERT INTO patient_user (patient_ID,userName, password) VALUES (?, ?,?) ON DUPLICATE KEY UPDATE password = VALUES(password)',
            [patientId, userName,hashedPassword]
        );

        // Clean up: remove verification entry after successful account creation
        delete verificationCode[email];

        res.status(200).json({ success: true, message: 'Account created successfully' });
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ error: 'Database error' });
    }
});

// Patient login
router.post('/login', async (req, res) => {
    const { userName, password } = req.body;
    console.log("Received Patient Login Details:", req.body);

    if (!userName || !password) {
        return res.status(400).json({ error: 'Patient ID and password are required' });
    }

    try {
        // Fetch patient account  details from the database
        const [results] = await pool.query(
            'SELECT master_ID,userName, password FROM patient_user WHERE userName = ?',
            [userName]
        );

        if (results.length === 0) {
            return res.status(404).json({ error: 'Account not found' });
        }

        const master_ID = results[0].master_ID;
        const { password: hashedPassword } = results[0];

        // Compare the hashed password
        const passwordMatch = await bcrypt.compare(password, hashedPassword);

        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        // Respond with success if login is successful
        res.json({ success: true, message: 'Login successful', userName , master_ID});
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ error: 'Database error' });
    }
});


module.exports = router;
