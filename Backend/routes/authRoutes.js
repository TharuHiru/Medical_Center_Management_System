const express = require('express');
const bcrypt = require('bcryptjs');
const pool = require('../config/db');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const QRCode = require('qrcode'); // QR code generator
//const nodemailer = require('nodemailer');

const router = express.Router();
const userTempData = {}; // Temporary storage for step 1 data

// Doctor Registration :- step1
router.post('/register/step1', (req, res) => {
    const { title, FirstName, LastName, email, Speciality } = req.body; // get the data from the request body

    if (!title || !FirstName || !LastName || !Speciality || !email)  //Validate if all the data is provided
    {
        return res.status(400).json({ message: "All fields are required." });
    }

    userTempData[email] = { title, FirstName, LastName, Speciality , email};// Store data temporarily using email as a key
    console.log("Stored Step 1 Data:", userTempData); //log for debugging
    res.status(200).json({ success: true, message: 'Step 1 complete. Proceed to Step 2.', email });
});


// Doctor Registration :- step2 
router.post('/register/step2', async (req, res) => {
    console.log("Received Step 2 Data:", req.body); // Log received data

    const { email, username, password, secretKey } = req.body; // Get data from the request body

    if (!email || !username || !password || !secretKey)  // Validate if all the data is provided
    {
        return res.status(400).json({ message: "All fields are required" });
    }

    if (secretKey !== "polyAdmin") {  // Check the secret key
        return res.status(400).json({ message: 'Invalid secret key.' });
    }

    if (!userTempData[email]) {    // Check if step 1 data exists
        return res.status(400).json({ message: 'Step 1 must be completed first.' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10); // Hash the password

        const userData = { ...userTempData[email], username, password: hashedPassword };   // Merge step 1 and step 2 data

        const query = `INSERT INTO doctor (Title, First_Name, Last_Name, Email, Speciality, User_Name, Password) 
                       VALUES (?, ?, ?, ?, ?, ?, ?)`; // Query to save the data in the database using async/await

        await pool.query(query, [
            userData.title,
            userData.FirstName,
            userData.LastName,
            email,
            userData.Speciality,
            username,
            userData.password
        ]);

        delete userTempData[email]; // Remove temp data after successful registration

        console.log("User registered and temporary data deleted:", email);

        return res.status(201).json({ success: true , message: 'User registered successfully.' });

    } 
    catch (error) {
        console.error('Error inserting data:', error);
        return res.status(500).json({ message: 'Server error.' });
    }
});


    // Doctor Login
    router.post ('/doctor-login', async (req , res) =>{
    const {UserName, password} = req.body; // get the data from the request body

    try{
        const [rows] = await pool.query ("SELECT * FROM doctor WHERE User_Name = ?" , [UserName]);

        if(rows.length === 0){
            return res.status(401).json ({success:false, message: "User not found!"})
        }

        const LoggedDoctor = rows[0];

        const isMatch = await bcrypt.compare (password , LoggedDoctor.Password);

        if (!isMatch){
            console.log("Invalid Credentials")
            return res.status(401).json({success:false , message:"Invalid Credentials !"})
        }

        // Generate JWT token
            const token = jwt.sign({ id: LoggedDoctor.id }, "your_secret_key", { expiresIn: "1h" });
            return res.json({ 
                success: true, 
                message: "Login successful!", 
                token,
                user: {
                    firstName: LoggedDoctor.First_Name,
                    lastName: LoggedDoctor.Last_Name,
                }
        });
        } catch (error) {
            console.error("Login error:", error);
            res.status(500).json({ success: false, message: "Server error!" });
        }
});

    // Temporary Patient SignUp
    router.post('/tempory-patient-signup', async (req, res) => {
        console.log("Received Temporary Patient Data:", req.body);

        const { title, name, address, phone } = req.body;

        if (!title || !name || !address || !phone) {
            return res.status(400).json({ success: false, message: 'Please fill all the fields' });
        }

        try {
            const query = 'INSERT INTO temporary_patients (title, name, address, phone_number) VALUES (?, ?, ?, ?)';
            const values = [title, name, address, phone];

            await pool.query(query, values); // Using pool.query to interact with the database

            res.status(200).json({ success: true, message: 'Temporary patient added successfully' });
        } catch (err) {
            console.error('Error inserting temporary patient:', err);
            res.status(500).json({ success: false, message: 'Error adding temporary patient' });
        }
    });



//Register Assistant
    router.post('/register-assistant', async (req, res) => {
    console.log("Received Assistant Data:", req.body);
    const { nic, title, firstname, lastname, contact, houseNo, addline1, addline2, email } = req.body;

    if (!nic || !title || !firstname || !lastname || !contact || !houseNo || !addline1 || !addline2 || !email) {
        return res.status(400).json({ message: "All fields are required." });
    }

    // Check if assistant already exists
    const [rows] = await pool.query("SELECT * FROM assistant WHERE Assist_Email = ?", [email]);
    if (rows.length > 0) {  // Check if any rows exist
        return res.status(400).json({ message: 'Assistant already exists' });
    }

    
    // Generate a random password
    //const randomPassword = crypto.randomBytes(6).toString('hex'); // Example: "a3b4c6d7e9f1"

    const randomPassword = "tharu"; // Example: "a3b4c6d7e9f1"

    // Hash the password
    const hashedPassword = await bcrypt.hash(randomPassword, 10);

    try {
        const query = `INSERT INTO assistant (NIC, Title, First_Name, Last_Name, Contact_Number, House_No, Address_Line_1, Address_Line_2, Assist_Email, Assist_Password) 
                       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        await pool.query(query, [nic, title, firstname, lastname, contact, houseNo, addline1, addline2, email, hashedPassword]);

        // Send email with credentials
        //await sendEmail(email, randomPassword);

        return res.status(201).json({ success: true, message: 'Assistant registered successfully. Email sent!' });

    } 
    catch (error) {
        console.error('Error inserting data:', error);
        return res.status(500).json({ message: 'Server error.' });
    }
});

/* Function to send email
async function sendEmail(email, password) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,  
            pass: process.env.EMAIL_PASS   
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your Assistant Account Details',
        text: `Hello, \n\nYour account has been created. \n\nLogin Details: \nEmail: ${email}\nPassword: ${password}\n\nPlease change your password on your first login.\n\nBest Regards`
    };

    await transporter.sendMail(mailOptions);
}
*/


// Assistant Login
router.post('/assistant-login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const [rows] = await pool.query("SELECT * FROM assistant WHERE Assist_Email = ?", [email]);

        if (rows.length === 0) {
            return res.status(401).json({ success: false, message: "Assistant not found!" });
        }

        const LoggedAssistant = rows[0];

        const isMatch = await bcrypt.compare(password, LoggedAssistant.Assist_Password);

        if (!isMatch) {
            console.log("Invalid Credentials")
            return res.status(401).json({ success: false, message: "Invalid Credentials !" });
        }
    
        // Generate JWT token
        const token = jwt.sign({ id: LoggedAssistant.id }, "your_secret_key", { expiresIn: "1h" });
        return res.json({ 
            success: true, 
            message: "Login successful!", 
            token,
            user: {
                firstName: LoggedAssistant.First_Name,
                lastName: LoggedAssistant.Last_Name,
            }
    });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ success: false, message: "Server error!" });
    }
});

//Route for register patients
router.post('/register-patient', async (req, res) => {
    console.log("Received Patient Data:", req.body); // Log incoming data
    
    const { title, firstname, lastname, contact, gender, dob, houseNo, addline1, addline2, email } = req.body;

    // Validation: Check required fields
    if (!title || !firstname || !lastname || !contact || !gender || !dob || !houseNo || !addline1 || !addline2 || !email) {
        console.log("Validation failed: Missing fields"); // Log validation failure
        return res.status(400).json({ message: "All fields are required." });
    }
    
    try {
        // Step 1: Get the last patient ID
        console.log("Fetching last patient ID...");

        const [lastPatient] = await pool.query("SELECT patient_ID FROM patients ORDER BY patient_ID DESC LIMIT 1");
        console.log("Last patient ID fetched:", lastPatient);

        let newPatientID = "PC_ID00001"; // Default for first patient
        if (lastPatient.length > 0) {
            // Step 2: Extract and Increment the number
            const lastID = lastPatient[0].patient_ID;  // e.g., PC_ID00010
            const lastNumber = parseInt(lastID.substring(5)); // Extract "00010" -> 10
            const nextNumber = lastNumber + 1;
            newPatientID = `PC_ID${String(nextNumber).padStart(5, '0')}`; // Format it

            console.log("Generated new patient ID:", newPatientID);
        }
        
        // Step 3: Generate QR Code
        console.log("Generating QR code...");
        const qrData = `https://yourwebsite.com/patient-card/${newPatientID}`; // URL encoded in QR
        const qrCodeImage = await QRCode.toDataURL(qrData); // Generate base64 QR code
        console.log("QR Code generated");

        const assist_ID = "1"; // For Now Hardcorded the Assistant ID. This should be get from the session

        // Step 4: Insert new patient into database
        console.log("Inserting new patient into database...");

        const query = `INSERT INTO patients (patient_ID,assist_ID, title, firstName, lastName, contactNo, gender, DOB, house_no, addr_line_1, addr_line_2, email) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)`;
        
        console.log("Database query:", query);
        console.log("Inserting patient data:", [newPatientID,assist_ID, title, firstname, lastname, contact, gender, dob, houseNo, addline1, addline2, email]);

        await pool.query(query, [newPatientID,assist_ID, title, firstname, lastname, contact, gender, dob, houseNo, addline1, addline2, email]);

        console.log("Patient registered successfully");

        // Step 5: Respond with success
        return res.status(201).json({ 
            success: true, 
            message: 'Patient registered successfully.', 
            patientID: newPatientID,
            name: `${title} ${firstname} ${lastname}`,
            qrCode: qrCodeImage, 
            qrPage: qrData 
        });
    
    } catch (error) {
        console.error('Error occurred while registering patient:', error); // Log detailed error
        return res.status(500).json({ message: 'Server error.' });
    }
});

module.exports = router;
