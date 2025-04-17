const express = require("express");
const router = express.Router();
const db = require("../config/firebase"); // Firestore database
const pool = require('../config/db'); // MySQL connection pool

// ✅ Add an Appointment with Patient ID as Document ID
router.post("/", async (req, res) => {
  try {
    const { patientID,appointmentDate } = req.body;

    if (!patientID) {
      return res.status(400).json({ error: "Patient ID is required" });
    }

    // Check if the appointment already exists
    const existingAppointment = await db.collection("appointments").doc(patientID).get();
    if (existingAppointment.exists && existingAppointment.data().status === "pending") {
      return res.status(400).json({ error: "You already have an appointment!" });
    }

    // Create appointment data
    const newAppointment = {
      appointmentDate,
      status: "pending", // Default status
      createdAt: new Date(),
    };

    // Save to Firestore with patientID as the document ID
    await db.collection("appointments").doc(patientID).set(newAppointment);

    res.status(201).json({ id: patientID, message: "Appointment added successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// ✅ Get all appointments for the doctor
router.get("/doctor-view", async (req, res) => {
  try {
    const snapshot = await db.collection("appointments").orderBy("createdAt").get();
    let appointments = [];

    snapshot.forEach((doc) => {
      appointments.push({ id: doc.id, ...doc.data() });
    });

    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Admit a patient (Firestore & MySQL Atomic Transaction)
router.put("/admit", async (req, res) => {
  const { patientID, appointmentDate } = req.body;
  console.log(req.body)
  if (!patientID || !appointmentDate) {
    return res.status(400).json({ success: false, error: "Missing required fields" });
  }

  const appointmentRef = db.collection("appointments").doc(patientID);
  const connection = await pool.getConnection();

  // Generate random appointment ID like A_123456
  const appointmentID = `A_${Math.floor(100000 + Math.random() * 900000)}`;

  try {
    // Start MySQL transaction
    await connection.beginTransaction();

    // Firestore transaction
    await db.runTransaction(async (transaction) => {
      transaction.update(appointmentRef, { status: "in progress" });

      // MySQL Query
      const sql = `INSERT INTO appointment (appoint_ID,patient_ID, date, time)VALUES (?,?, ?, ?)`;

      // Convert date formats correctly
      const sqlDate = new Date(appointmentDate).toISOString().split("T")[0]; // YYYY-MM-DD
      const now = new Date();
      const sqlTime = now.toTimeString().slice(0, 8); // Gets local time HH:mm:ss

      const [result] = await connection.execute(sql, [appointmentID,patientID, sqlDate, sqlTime]);

      if (result.affectedRows === 0) {
        throw new Error("MySQL insert failed.");
      }
    });

    // Commit MySQL transaction
    await connection.commit();
    res.status(200).json({ success: true, message: "Patient admitted successfully!", appointmentID });
  } catch (error) {
    console.error("Error admitting patient:", error.message);

    // Rollback MySQL transaction on failure
    await connection.rollback();

    res.status(500).json({ success: false, error: error.message });
  } finally {
    // Release MySQL connection back to the pool
    connection.release();
  }
});

module.exports = router;


// ✅ Remove a patient from the queue after seen by doctor (Firestore Delete)
router.delete("/remove", async (req, res) => {
  const { patientID } = req.body;
  if (!patientID) {
    return res.status(400).json({ success: false, error: "Missing patientID" });
  }

  const appointmentRef = db.collection("appointments").doc(patientID);

  try {
    // Delete the patient's appointment from Firestore
    await appointmentRef.delete();

    res.status(200).json({ success: true, message: "Patient removed from queue!" });
  } catch (error) {
    console.error("Error removing patient:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;