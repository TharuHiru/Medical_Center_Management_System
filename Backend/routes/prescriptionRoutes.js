const express = require('express');
const pool = require('../config/db');
const db = require("../config/firebase"); // Firestore database
const router = express.Router();

// Generate a random prescription ID
function generatePrescriptionID() {
  return `P_${Math.floor(100000 + Math.random() * 900000)}`; // P_6-digit random number
}

//Add  a prescription
router.post("/addPrescription", async (req, res) => {
  const { date, diagnosis, otherNotes, patient_ID, doctor_ID, medicines } = req.body;

  if (!date || !diagnosis || !patient_ID || !doctor_ID || !Array.isArray(medicines) || medicines.length === 0) {
    return res.status(400).json({ success: false, message: "Missing or invalid input data" });
  }

  const connection = await pool.getConnection();
  const prescription_ID = generatePrescriptionID();

  try {
    await connection.beginTransaction();

    // Get patient's first and last name
    const [patientRows] = await connection.query(
      "SELECT firstName, lastName FROM patients WHERE patient_ID = ?",
      [patient_ID]
    );

    if (patientRows.length === 0) {
      throw new Error("Patient not found");
    }

    const patientName = `${patientRows[0].firstName} ${patientRows[0].lastName}`;


    // Insert into prescription table
    const [result] = await connection.query(
      "INSERT INTO prescription (prescription_ID, Date, Diagnosis, patient_ID, doctor_ID, other) VALUES (?,?, ?, ?, ?, ?)",
      [prescription_ID,date, diagnosis, patient_ID, doctor_ID, otherNotes]
    );

    // Insert each medicine
    for (const med of medicines) {
      const [medicine] = await connection.query(
        "SELECT medicine_ID FROM medicine_category WHERE medicine_Name = ?",
        [med.medicine_Name]
      );

      if (medicine.length === 0) {
        throw new Error(`Medicine not found: ${med.medicine_Name}`);
      }

      const medicine_ID = medicine[0].medicine_ID;

      await connection.query(
        "INSERT INTO prescription_medicine (prescription_ID, medicine_ID, Dosage) VALUES (?, ?, ?)",
        [prescription_ID, medicine_ID, med.dosage]
      );
    }

    // Save to Firebase Firestore
    await db.collection('prescriptions').doc(prescription_ID).set({
      prescription_ID,
      patient_ID,
      patientName,
      date,
      diagnosis,
      otherNotes,
      medicines, // raw medicine data as received
      createdAt: new Date()
    });

    await connection.commit();
    res.json({ success: true });

  } catch (err) {
    await connection.rollback();
    console.error("Transaction failed:", err);
    res.status(500).json({ success: false, message: err.message });
  } finally {
    connection.release();
  }
});

module.exports = router;
