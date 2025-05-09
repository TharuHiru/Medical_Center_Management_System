const pool = require('../config/db');

// Fetch all patients
exports.getAllPatients = async () => {
  const [rows] = await pool.query("SELECT * FROM patients");
  return rows;
};

// Update patient by ID
exports.updatePatient = async ({ patient_ID, title, firstName, lastName, contactNo, email }) => {
  const query = `
    UPDATE patients
    SET title = ?, firstName = ?, lastName = ?, contactNo = ?, email = ?
    WHERE patient_ID = ?
  `;
  const [result] = await pool.query(query, [title, firstName, lastName, contactNo, email, patient_ID]);
  return result;
};
