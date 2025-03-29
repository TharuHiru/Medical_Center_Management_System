const express = require('express');
const pool = require('../config/db');
const router = express.Router();

//Get all patients list
router.get('/fetch-patients', async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM patients");
        
        // Log fetched data
        console.log('Fetched Patients:', rows);

        return res.status(200).json({ success: true, data: rows });
    } catch (error) {
        console.error('Error fetching patients:', error);
        return res.status(500).json({ success: false, message: 'Server error.' });
    }
});

//update patients data
router.put("/updatePatient", (req, res) => {
    const {
      patient_ID,
      title,
      firstName,
      lastName,
      contactNo,
      email
    } = req.body;

    console.log(req.body);
  
    // SQL query to update the patient record
    const query = `
      UPDATE patients
      SET title = ?, firstName = ?, lastName = ?, contactNo = ?, email = ?
      WHERE patient_ID = ?
    `;
  
    // Execute the query with values
    pool.query(query, [title, firstName, lastName, contactNo, email, patient_ID], (err, result) => {
    if (err) {
      console.error("Error updating patient:", err);
      return res.status(500).json({ success: false, message: "Error updating patient details" });
    }
  
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Patient not found" });
    }
  
    return res.status(200).json({ success: true, message: "Patient updated successfully" });
  });
  });

module.exports = router;