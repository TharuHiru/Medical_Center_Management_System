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
  const { status,date, diagnosis, otherNotes, patient_ID, doctor_ID, medicines , appointment_ID } = req.body;
  console.log(req.body);

  if (!diagnosis || !patient_ID || !Array.isArray(medicines) || medicines.length === 0) {
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
    const status = "pending"; 

    // Insert into prescription table
    const [result] = await connection.query(
      "INSERT INTO prescription (prescription_ID, Date, Diagnosis, patient_ID, doctor_ID, other , appointment_ID,status) VALUES (?,?, ?, ?, ?, ?,?,?)",
      [prescription_ID,date, diagnosis, patient_ID, doctor_ID, otherNotes,appointment_ID,status]
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
      status,
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


// Get the allergies of the patient
router.get("/getPatientAllergies/:patientId", async (req, res) => {
  const patientId = req.params.patientId;

  if (!patientId) {
    return res.status(400).json({ success: false, message: "Missing patient ID" });
  }

  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query("SELECT allergies FROM patients WHERE patient_ID = ?",[patientId]);

    connection.release();

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Patient not found" });
    }

    console.log(rows[0].allergies);
    res.json({ success: true, allergies: rows[0].allergies });

  } catch (error) {
    console.error("Error fetching patient allergies:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// Edit the allergies of the patient
router.put("/editPatientAllergies/:patientId", async (req, res) => {
  const patientId = req.params.patientId;
  const { allergies } = req.body;

  if (!patientId || !allergies) {
    return res.status(400).json({ success: false, message: "Missing patient ID or allergies" });
  }

  try {
    const connection = await pool.getConnection();
    await connection.query("UPDATE patients SET allergies = ? WHERE patient_ID = ?", [allergies, patientId]);
    connection.release();
    res.json({ success: true, message: "Allergies updated successfully" });

  } catch (error) {
    console.error("Error updating allergies:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;
