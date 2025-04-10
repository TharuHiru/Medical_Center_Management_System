const express = require('express');
const pool = require('../config/db');
const router = express.Router();

router.post("/addPrescription", async (req, res) => {
  const { date, diagnosis, otherNotes, patient_ID, doctor_ID, medicines } = req.body;

  if (!date || !diagnosis || !patient_ID || !doctor_ID || !Array.isArray(medicines) || medicines.length === 0) {
    return res.status(400).json({ success: false, message: "Missing or invalid input data" });
  }

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // Insert into prescription table
    const [result] = await connection.query(
      "INSERT INTO prescription (Date, Diagnosis, patient_ID, doctor_ID, other) VALUES (?, ?, ?, ?, ?)",
      [date, diagnosis, patient_ID, doctor_ID, otherNotes]
    );

    const prescription_ID = result.insertId;

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
        "INSERT INTO prescription_medicine (prescription_ID, medicine_ID, Dosage, No_Of_Units) VALUES (?, ?, ?, ?)",
        [prescription_ID, medicine_ID, med.dosage, med.unitCount]
      );
    }

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
