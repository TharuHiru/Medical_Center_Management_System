const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authModel = require('../models/authModel');
const userTempData = {}; // In-memory temporary storage

// Step 1 - Store doctor basic info
const registerStep1 = (req, res) => {
    const { title, FirstName, LastName, email, Speciality } = req.body;
    if (!title || !FirstName || !LastName || !Speciality || !email) {
        return res.status(400).json({ message: "All fields are required." });
    }

    userTempData[email] = { title, FirstName, LastName, Speciality, email };
    console.log("Stored Step 1 Data:", userTempData);
    res.status(200).json({ success: true, message: 'Step 1 complete. Proceed to Step 2.', email });
};

// Step 2 - Save doctor credentials
const registerStep2 = async (req, res) => {
    const { email, username, password, secretKey } = req.body;

    if (!email || !username || !password || !secretKey) {
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
        const userData = { ...userTempData[email], username, password: hashedPassword };
        await insertDoctor(userData);
        delete userTempData[email];

        res.status(201).json({ success: true, message: 'User registered successfully.' });
    } catch (error) {
        console.error('Error inserting data:', error);
        res.status(500).json({ message: 'Server error.' });
    }
};

// Doctor login
const doctorLogin = async (req, res) => {
    const { UserName, password } = req.body;

    try {
        const rows = await findDoctorByUsername(UserName);
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

// signup the teporary patient
const tempPatientSignup = async (req, res) => {
    const { title, name, address, phone } = req.body;

    if (!title || !name || !address || !phone) {
        return res.status(400).json({ success: false, message: 'Please fill all the fields' });
    }

    try {
        await authModel.insertTempPatient({ title, name, address, phone });
        res.status(200).json({ success: true, message: 'Temporary patient added successfully' });
    } catch (err) {
        console.error('Error inserting temporary patient:', err);
        res.status(500).json({ success: false, message: 'Error adding temporary patient' });
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
            return res.status(400).json({ message: 'Assistant already exists' });
        }

        const randomPassword = "tharu"; // Secure this later
        const hashedPassword = await bcrypt.hash(randomPassword, 10);

        await authModel.insertAssistant({
            nic,title,firstname,lastname,contact,houseNo,addline1,addline2,email,
            password: hashedPassword
        });

        return res.status(201).json({ success: true, message: 'Assistant registered successfully. Email sent!' });
    } catch (error) {
        console.error('Error inserting assistant:', error);
        return res.status(500).json({ message: 'Server error.' });
    }
};

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

        const token = jwt.sign({ id: assistant.id }, "your_secret_key", { expiresIn: "1h" });

        return res.json({
            success: true,
            message: "Login successful!",
            token,
            user: {
                firstName: assistant.First_Name,
                lastName: assistant.Last_Name
            }
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

module.exports = {
    registerStep1,
    registerStep2,
    doctorLogin,
    tempPatientSignup,
    registerAssistant,
    assistantLogin,
    fetchMasterAccounts
};
