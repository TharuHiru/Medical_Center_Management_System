const pool = require('../config/db');

//check patientd has an account
const checkExistingUser = async (PID) => {
    const [rows] = await pool.query('SELECT * FROM patient_user WHERE patient_ID = ?', [PID]);
    return rows;
};

//get patient Email
const getEmailByPID = async (PID) => {
    const [rows] = await pool.query('SELECT email FROM patients WHERE patient_ID = ?', [PID]);
    return rows;
};

// create new patient user
const insertPatientUser = async (patientId, userName, hashedPassword) => {
    const [result] = await pool.query(
        'INSERT INTO patient_user (patient_ID, userName, password) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE password = VALUES(password)',
        [patientId, userName, hashedPassword]
    );
    return result;
};

// get master account for user
const getUserByUsername = async (userName) => {
    const [rows] = await pool.query('SELECT master_ID, userName, password FROM patient_user WHERE userName = ?', [userName]);
    return rows;
};

// get the userID or mastr ID
const getPrimaryPatientID = async (master_ID) => {
    const [rows] = await pool.query('SELECT patient_ID FROM patient_user WHERE master_ID = ?', [master_ID]);
    return rows;
};

// get account patinet IDS of master ID
const getLinkedPatientIDs = async (master_ID) => {
    const [rows] = await pool.query('SELECT patient_ID FROM master_patient_links WHERE master_ID = ?', [master_ID]);
    return rows;
};

// get patient details
const getPatientDetails = async (IDs) => {
    if (!IDs.length) return [];
    const [rows] = await pool.query(
        `SELECT * FROM patients WHERE patient_ID IN (${IDs.map(() => '?').join(',')})`,
        IDs
    );
    return rows;
};

//get apopintment details
const getAppointments = async (patient_ID) => {
    const [rows] = await pool.query('SELECT * FROM appointment WHERE patient_ID = ?', [patient_ID]);
    return rows;
};

//get prescription details
const getPrescriptions = async (appoint_ID) => {
    const [rows] = await pool.query('SELECT * FROM prescription WHERE appointment_ID = ?', [appoint_ID]);
    return rows;
};

const getPaymentDetails = async (prescription_ID) => {
    const [rows] = await pool.query(
        'SELECT full_amount FROM payments WHERE prescription_ID = ?', 
        [prescription_ID]
    );
    return rows[0] || { full_amount: 0 }; // Return 0 if no payment found
};

// get medicine details
const getMedicines = async (prescription_ID) => {
    const [rows] = await pool.query(
        `SELECT pm.*, m.medicine_Name AS medicine_name 
         FROM prescription_medicine pm 
         JOIN medicine_category m ON pm.medicine_ID = m.medicine_ID 
         WHERE pm.prescription_ID = ?`,
        [prescription_ID]
    );
    return rows;
};

//get patient details
const getPatientDetailsByID = async (patient_ID) => {
    const [rows] = await pool.query('SELECT * FROM patients WHERE patient_ID = ?', [patient_ID]);
    return rows;
};


module.exports = {
    checkExistingUser,
    getEmailByPID,
    insertPatientUser,
    getUserByUsername,
    getPrimaryPatientID,
    getLinkedPatientIDs,
    getPatientDetails,
    getAppointments,
    getPrescriptions,
    getMedicines,
    getPatientDetailsByID,
    getPaymentDetails
};
