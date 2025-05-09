const pool = require('../config/db');

//save doctor data to the database
const insertDoctor = async (doctorData) => {
    const query = `INSERT INTO doctor (Title, First_Name, Last_Name, Email, Speciality, User_Name, Password) 
                   VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const values = [
        doctorData.title, doctorData.FirstName, doctorData.LastName,doctorData.email,doctorData.Speciality,doctorData.username,doctorData.password,
    ];
    return pool.query(query, values);
};

//get doctor details by username
const findDoctorByUsername = async (username) => {
    const [rows] = await pool.query("SELECT * FROM doctor WHERE User_Name = ?", [username]);
    return rows;
};

//save temporary patient data to the database
const insertTempPatient = async (tempPatientData) => {
    const query = 'INSERT INTO temporary_patients (title, name, address, phone_number) VALUES (?, ?, ?, ?)';
    const values = [tempPatientData.title,tempPatientData.name,tempPatientData.address,tempPatientData.phone
    ];
    return pool.query(query, values);
};

// get assistant details by email
const findAssistantByEmail = async (email) => {
    const [rows] = await pool.query('SELECT * FROM assistant WHERE Assist_Email = ?', [email]);
    return rows;
};

// save assistant data to the database
const insertAssistant = async (assistantData) => {
    const query = `INSERT INTO assistant 
        (NIC, Title, First_Name, Last_Name, Contact_Number, House_No, Address_Line_1, Address_Line_2, Assist_Email, Assist_Password , firstLogin) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)`;

    const values = [assistantData.nic,assistantData.title,assistantData.firstname,assistantData.lastname,
                    assistantData.contact,assistantData.houseNo,assistantData.addline1,assistantData.addline2,assistantData.email,assistantData.password,assistantData.firstLogin
    ];

    return pool.query(query, values);
};

// Fetch all master accounts
const getMasterAccounts = async () => {
    const [rows] = await pool.query(`
        SELECT 
            pu.patient_id, 
            p.firstName, 
            p.lastName
        FROM 
            patient_user pu
        JOIN 
            patients p ON pu.patient_id = p.patient_ID
    `);
    return rows;
};

// change assistant password and update firstLogin flag
const updateAssistantPasswordAndFlag = async (id, hashedPassword) => {
    const sql = "UPDATE assistant SET Assist_Password = ?, firstLogin = false WHERE assist_ID = ?";
    const values = [hashedPassword, id];
    return pool.query(sql, values);
};

module.exports = {
    insertDoctor,
    findDoctorByUsername,
    insertTempPatient,
    findAssistantByEmail,
    insertAssistant,
    getMasterAccounts,
    updateAssistantPasswordAndFlag,
};
