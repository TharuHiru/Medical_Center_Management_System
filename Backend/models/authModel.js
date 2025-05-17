const pool = require('../config/db');
const QRCode = require('qrcode');

//save doctor data to the database
const insertDoctor = async (doctorData) => {
    const query = `INSERT INTO doctor (Title, First_Name, Last_Name, Email, Speciality, Password) 
                   VALUES (?, ?, ?, ?, ?, ?)`;
    const values = [
        doctorData.title, doctorData.FirstName, doctorData.LastName,doctorData.email,doctorData.Speciality,doctorData.password,
    ];
    return pool.query(query, values);
};

//get doctor details by username
const findDoctorByUsername = async (username) => {
    const [rows] = await pool.query("SELECT * FROM doctor WHERE Email = ?", [username]);
    return rows;
};

//save patients into database
const registerPatient = async (patientData, masterAccountID) => {
    const { title, firstname, lastname, contact, gender, dob, houseNo, addline1, addline2, email } = patientData;

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const [lastPatient] = await connection.query("SELECT patient_ID FROM patients ORDER BY patient_ID DESC LIMIT 1");
        
        let newPatientID = "PC_ID00001";
        if (lastPatient.length > 0) {
            const lastID = lastPatient[0].patient_ID;
            const nextNumber = parseInt(lastID.substring(5)) + 1;
            newPatientID = `PC_ID${String(nextNumber).padStart(5, '0')}`;
        }

        const qrData = `https://yourwebsite.com/patient-card/${newPatientID}`;
        const qrCodeImage = await QRCode.toDataURL(qrData);

        const assist_ID = "1"; // Hardcoded for now

        const insertPatientQuery = `
            INSERT INTO patients 
            (patient_ID, assist_ID, title, firstName, lastName, contactNo, gender, DOB, house_no, addr_line_1, addr_line_2, email) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        await connection.query(insertPatientQuery, [
            newPatientID, assist_ID, title, firstname, lastname, contact, gender, dob, houseNo, addline1, addline2, email
        ]);

        if (masterAccountID !== "") {
            const [masterIDResult] = await connection.query(
                "SELECT master_ID FROM patient_user WHERE patient_ID = ?", [masterAccountID]
            );

            if (masterIDResult.length === 0) {
                throw new Error("Master account not found");
            }

            const masterID = masterIDResult[0].master_ID;

            const insertLinkQuery = `
                INSERT INTO master_patient_links (master_ID, patient_ID)
                VALUES (?, ?)
            `;
            await connection.query(insertLinkQuery, [masterID, newPatientID]);
        }

        await connection.commit();
        return { newPatientID, qrCodeImage, qrData, fullName: `${title} ${firstname} ${lastname}` };
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
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
    registerPatient,
    insertTempPatient,
    findAssistantByEmail,
    insertAssistant,
    getMasterAccounts,
    updateAssistantPasswordAndFlag,
};
