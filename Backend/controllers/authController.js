const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authModel = require('../models/authModel');
const nodemailer = require('nodemailer');
const userTempData = {}; // In-memory temporary storage

// Step 1 - Store doctor basic info
const registerStep1 = async (req, res) => {
    const { title, FirstName, LastName, email, Speciality } = req.body;

    if (!title || !FirstName || !LastName || !Speciality || !email) {
        return res.status(400).json({ message: "All fields are required." });
    }

    try { // check whether the email already exists
        const rows = await authModel.findDoctorByUsername(email);
        if (rows.length === 1) {
            return res.status(401).json({ success: false, message: "Email already exists!" });
        }
        userTempData[email] = { title, FirstName, LastName, Speciality, email };
        console.log("Stored Step 1 Data:", userTempData);
        res.status(200).json({ success: true, message: 'Step 1 complete. Proceed to Step 2.', email });

    } catch (error) {
        console.error('Error checking email:', error);
        res.status(500).json({ message: 'Server error.' });
    }
};

// Step 2 - Save doctor credentials
const registerStep2 = async (req, res) => {
    const { email, password, secretKey } = req.body;

    if (!email || !password || !secretKey) {
        return res.status(400).json({ message: "All fields are required" });
    }

    if (secretKey !== "polyAdmin") {
        return res.status(400).json({ message: 'Invalid secret key.' });
    }

    if (!userTempData[email]) {
        return res.status(400).json({ message: 'Step 1 must be completed first.' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const userData = { ...userTempData[email], password: hashedPassword };
        await authModel.insertDoctor(userData);
        delete userTempData[email];

        res.status(201).json({ success: true, message: 'Doctor registered successfully.' });
    } catch (error) {
        console.error('Error inserting data:', error);
        res.status(500).json({ message: 'Server error.' });
    }
};

// Doctor login
const doctorLogin = async (req, res) => {
    const { UserName, password } = req.body;

    try {
        const rows = await authModel.findDoctorByUsername(UserName);
        if (rows.length === 0) {
            return res.status(401).json({ success: false, message: "User not found!" });
        }

        const LoggedDoctor = rows[0];
        const isMatch = await bcrypt.compare(password, LoggedDoctor.Password);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid Credentials!" });
        }

        const token = jwt.sign({ id: LoggedDoctor.id }, "your_secret_key", { expiresIn: "1h" });

        res.json({
            success: true,
            message: "Login successful!",
            token,
            user: {
                _id: LoggedDoctor.doc_ID,
                firstName: LoggedDoctor.First_Name,
                lastName: LoggedDoctor.Last_Name,
            }
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ success: false, message: "Server error!" });
    }
};

//register the assistant
const registerAssistant = async (req, res) => {
    const { nic, title, firstname, lastname, contact, houseNo, addline1, addline2, email } = req.body;

    if (!nic || !title || !firstname || !lastname || !contact || !houseNo || !addline1 || !addline2 || !email) {
        return res.status(400).json({ message: "All fields are required." });
    }

    try {
        const existing = await authModel.findAssistantByEmail(email);
        if (existing.length > 0) {
            return res.status(400).json({ message: 'Assistant for this email is already exists' });
        }

        // create random password and hack it
        const generateRandomPassword = () => {return crypto.randomBytes(6).toString('base64');}; // 8-char password};
        const randomPassword = generateRandomPassword();
        const hashedPassword = await bcrypt.hash(randomPassword, 10);

        await authModel.insertAssistant({
            nic,title,firstname,lastname,contact,houseNo,addline1,addline2,email,
            password: hashedPassword,
            firstLogin: true
        });

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
                    subject: 'Your Assistant Account Password for POLYCLINIC web site',
                    text: `Hello ${firstname},\n\nYour account has been created.\nYour temporary password is: ${randomPassword}\nPlease log in and change your password.\n\nRegards,\nTeam`
                };

                await transporter.sendMail(mailOptions);
                res.json({ message: 'Assistant Account Created and Verification email sent successfully !' });    
            } catch (error) {
                console.error('Error inserting assistant:', error);
                return res.status(500).json({ message: 'Server error.' });
    }
};

// Assistant login logic
const assistantLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const assistantData = await authModel.findAssistantByEmail(email);
        if (assistantData.length === 0) {
            return res.status(401).json({ success: false, message: "Assistant not found!" });
        }

        const assistant = assistantData[0];

        const isMatch = await bcrypt.compare(password, assistant.Assist_Password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid Credentials!" });
        }

        const token = jwt.sign({ id: assistant.assist_ID }, "your_secret_key", { expiresIn: "1h" });

        console.log (assistant.firstLogin);
        return res.json({
            success: true,
            message: "Login successful!",
            token,
            firstLogin: assistant.firstLogin,

            //data set in the auth context
            user: {
                id: assistant.assist_ID,
                firstName: assistant.First_Name,
                lastName: assistant.Last_Name}
        });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ success: false, message: "Server error!" });
    }
};

const fetchMasterAccounts = async (req, res) => {
    try {
        const rows = await authModel.getMasterAccounts();
        console.log("Fetched master accounts:", rows);
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching master accounts:', error);
        res.status(500).json({ message: 'Server error.' });
    }
};

//change assistant password
const changeAssistantPassword = async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    try {
        const decoded = jwt.verify(token, "your_secret_key");
        const { newPassword } = req.body;

        const hashed = await bcrypt.hash(newPassword, 10);
        console.log("Decoded token ID:", decoded.id);


        const result = await authModel.updateAssistantPasswordAndFlag(decoded.id, hashed);
        console.log("Update result",result);        
        return res.status(200).json({ message: "Password updated successfully." });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Error updating password" });
    }
};

const registerPatient = async (req, res) => {
    console.log("Received Patient Data:", req.body);

    const { title, firstname, lastname, contact, gender, dob, houseNo, addline1, addline2, email, masterAccountID } = req.body;

    if (!title || !firstname || !lastname || !contact || !gender || !dob || !houseNo || !addline1 || !addline2 || !email) {
        return res.status(400).json({ message: "All fields are required." });
    }

    try {
        const { newPatientID, qrCodeImage, qrData, fullName } = await authModel.registerPatient(req.body, masterAccountID);

        return res.status(201).json({ 
            success: true,
            message: 'Patient registered successfully.', 
            patientID: newPatientID,
            name: fullName,
            qrCode: qrCodeImage,
            qrPage: qrData
        });
    } catch (error) {
        console.error("Transaction failed, rolled back:", error.message);
        return res.status(500).json({ message: 'Server error during registration.' });
    }
};


module.exports = {
    registerStep1,
    registerStep2,
    doctorLogin,
    registerAssistant,
    assistantLogin,
    fetchMasterAccounts,
    changeAssistantPassword,
    registerPatient
};
