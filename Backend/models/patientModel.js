const pool = require('../config/db');

// Fetch all patients
exports.getAllPatients = async () => {
  const [rows] = await pool.query("SELECT * FROM patients");
  return rows;
};

// Update patient by ID
exports.updatePatient = async (patientId, patientData) => {
  const { title, firstName, lastName, contactNo, email, gender, DOB, house_no, addr_line_1, addr_line_2 } = patientData;
  
  const query = `
    UPDATE patients
    SET 
      title = ?,
      firstName = ?,
      lastName = ?,
      contactNo = ?,
      email = ?,
      gender = ?,
      DOB = ?,
      house_no = ?,
      addr_line_1 = ?,
      addr_line_2 = ?
    WHERE patient_ID = ?
  `;
  
  const [result] = await pool.query(query, [
    title,
    firstName,
    lastName,
    contactNo,
    email,
    gender,
    DOB,
    house_no,
    addr_line_1,
    addr_line_2,
    patientId
  ]);
  
  return result;
};
