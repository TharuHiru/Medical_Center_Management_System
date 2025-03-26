const express = require("express");
const router = express.Router();
const db = require("../config/firebase");

// ✅ Add an Appointment
router.post("/", async (req, res) => {
  try {
    const { patientID, patientName, appointmentDate, status } = req.body;

    // Create appointment data
    const newAppointment = {
      patientName,
      appointmentDate,
      status: status || "pending", // Default status is 'pending'
      createdAt: new Date()
    };

    // Save to Firestore
    await db.collection("appointments").doc(patientID).set(newAppointment);

    res.status(201).json({ message: "Appointment added successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Get Real-time Appointments
router.get("/", async (req, res) => {
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

module.exports = router;
