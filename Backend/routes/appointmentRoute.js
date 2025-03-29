const express = require("express");
const router = express.Router();
const db = require("../config/firebase"); // import firebase database

// ✅ Add an Appointment with Patient ID as Document ID
router.post("/", async (req, res) => {
  try {
    const { patientID, patientName, appointmentDate } = req.body; //get the details from the requirement body

    if (!patientID) {
      return res.status(400).json({ error: "Patient ID is required" });
    }

    // Check if the appointment already exists
    const existingAppointment = await db.collection("appointments").doc(patientID).get();

    if (existingAppointment.exists) {
      return res.status(400).json({ error: "You already have an appointment!" });
    }

    // Create appointment data
    const newAppointment = {
      patientName,
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

// ✅ Get Real-time Appointments
router.get("/", async (req, res) => {
  try {
    const snapshot = await db.collection("appointments").orderBy("createdAt").get();
    
    let appointments = []; // Initialize an empty array
    // Loop through appointment documents
    snapshot.forEach((doc) => {
      appointments.push({ id: doc.id, ...doc.data() });
    });

    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

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
