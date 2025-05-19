const pool = require('../config/db');

exports.getPatientEmailById = async (patientId) => {
  try {
    const [rows] = await pool.query( "SELECT email FROM patients WHERE patient_ID = ?", [patientId]);
    return rows[0]?.email;
  } catch (error) {
    console.error('Error fetching patient email:', error);
    throw error;
  }
};