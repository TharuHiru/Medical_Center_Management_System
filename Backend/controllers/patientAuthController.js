const patientAuthModel = require('../models/patientAuthModel');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');

const verificationCode = {};
const saltRounds = 10;

// Send Verification Email
const sendVerification = async (req, res) => {
    const { PID } = req.body;
    if (!PID) return res.status(400).json({ error: 'Patient ID is required' });

    try {
        //check whether there is an account for this patient already
        const existingUser = await patientAuthModel.checkExistingUser(PID);
        if (existingUser.length > 0)
            return res.status(400).json({ error: 'An account with this Patient ID already exists' });

        const emailResult = await patientAuthModel.getEmailByPID(PID);
        if (emailResult.length === 0) return res.status(404).json({ error: 'Email not found' });

        // Generate a random verification code
        const email = emailResult[0].email;
        const code = crypto.randomInt(100000, 999999).toString();
        verificationCode[email] = { code, patientId: PID };

        // Send the verification code to the user's email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            },
            tls: { rejectUnauthorized: false }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Verification Code to Set Up Your Account',
            text: `Please use this verification code to create your account: ${code}`
        };

        await transporter.sendMail(mailOptions);
        res.json({ message: 'Verification email sent successfully' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Verify the code
const verifyCode = (req, res) => {
    const { fullcode } = req.body;
    const email = Object.keys(verificationCode).find(email => verificationCode[email].code === fullcode);
    if (email) return res.json({ success: true, message: "Code verified successfully" });
    return res.status(400).json({ success: false, error: "Invalid verification code" });
};

// Set the account Password
const setPassword = async (req, res) => {
    const { password, userName } = req.body;

    if (!password) return res.status(400).json({ error: 'Password is required' });

    try {
        const email = Object.keys(verificationCode)[0];
        const data = verificationCode[email];

        if (!data) return res.status(400).json({ error: 'Verification code has expired' });

        const hashedPassword = await bcrypt.hash(password, saltRounds);
        await patientAuthModel.insertPatientUser(data.patientId, userName, hashedPassword);
        delete verificationCode[email];

        res.json({ success: true, message: 'Account created successfully' });

    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ error: 'Database error' });
    }
};

//patient Login
const login = async (req, res) => {
    const { userName, password } = req.body;

    if (!userName || !password)
        return res.status(400).json({ error: 'Patient ID and password are required' });

    try {
        const users = await patientAuthModel.getUserByUsername(userName);

        if (!users || users.length === 0)
            return res.status(404).json({ error: 'Account not found' });

        const user = users[0];

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch)
            return res.status(401).json({ error: 'Invalid password' });

        res.json({ success: true, message: 'Login successful', userName, master_ID: user.master_ID });

    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ error: 'Database error' });
    }
};


// Fetch patient IDs for a master account
const fetchPatientIDs = async (req, res) => {
    const { master_ID } = req.params;

    try {
        const primary = await patientAuthModel.getPrimaryPatientID(master_ID);
        const linked = await patientAuthModel.getLinkedPatientIDs(master_ID);

        const allIDs = [...primary.map(p => p.patient_ID), ...linked.map(p => p.patient_ID)];

        if (allIDs.length === 0) return res.status(404).json({ error: 'No patients found' });

        const patientDetails = await patientAuthModel.getPatientDetails(allIDs);
        res.json({ success: true, data: patientDetails });

    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ error: 'Database error' });
    }
};

// Fetch appointments for a patient
const fetchAppointments = async (req, res) => {
    const { patient_ID } = req.params;
    try {
        const appointments = await patientAuthModel.getAppointments(patient_ID);
        if (appointments.length === 0)
            return res.status(404).json({ error: 'No appointments found' });

        const detailed = await Promise.all(appointments.map(async (app) => {
            const prescriptions = await patientAuthModel.getPrescriptions(app.appoint_ID);
            const prescription = prescriptions[0] || null;

            let medicines = [];
            if (prescription) {
                medicines = await patientAuthModel.getMedicines(prescription.prescription_ID);
            }

            return { ...app, prescription, medicines };
        }));

        res.json({ success: true, data: detailed });

    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ error: 'Database error' });
    }
};

module.exports = {
    sendVerification,
    verifyCode,
    setPassword,
    login,
    fetchPatientIDs,
    fetchAppointments
};
