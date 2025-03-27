const express = require("express");
const router = express.Router();
const db = require("../config/firebase");

// ✅ Add an Appointment with Patient ID as Document ID
router.post("/", async (req, res) => {
  try {
    const { patientID, patientName, appointmentDate } = req.body;

    if (!patientID) {
      return res.status(400).json({ error: "Patient ID is required" });
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
