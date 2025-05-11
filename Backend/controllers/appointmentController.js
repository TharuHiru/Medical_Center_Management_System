const appointmentModel = require("../models/appointmentModel");

// Add new appointment for a patient (Firestore & MySQL Atomic Transaction - add to Firestore and MySQL)
async function addAppointment(req, res) {
  try {
    const { patientID, appointmentDate } = req.body;
    if (!patientID) {
      return res.status(400).json({ error: "Patient ID is required" });
    }

    const exists = await appointmentModel.checkAppointmentExists(patientID);
    if (exists) {
      return res.status(400).json({ error: "You already have an appointment!" });
    }

    await appointmentModel.addAppointment(patientID, appointmentDate);
    res.status(201).json({ id: patientID, message: "Appointment added successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Get all appointments for the doctor
async function getAppointments(req, res) {
  try {
    const appointments = await appointmentModel.getAppointments();
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Admit a patient (Firestore & MySQL Atomic Transaction - remove from firestore and add to MySQL)
async function admitPatient(req, res) {
  const { patientID, appointmentDate } = req.body;

  if (!patientID || !appointmentDate) {
    return res.status(400).json({ success: false, error: "Missing required fields" });
  }

  try {
    const appointmentID = await appointmentModel.admitPatient(patientID, appointmentDate);
    res.status(200).json({ success: true, message: "Patient admitted successfully!", appointmentID });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

// Remove a patient from the queue after seen by doctor (delete from Firestore 
async function removePatient(req, res) {
  const { patientID, appointmentDate } = req.body;

  if (!patientID || !appointmentDate) {
    return res.status(400).json({ success: false, error: "Missing required fields" });
  }

  try {
    await appointmentModel.removePatient(patientID, appointmentDate);
    res.status(200).json({ success: true, message: "Patient removed from queue!" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

const fetchPatients = async (req, res) => {
    try {
        const rows = await appointmentModel.fetchPatients();
        console.log('Fetched patients:', rows);
        return res.status(200).json({ success: true, data: rows });
    } catch (error) {
        console.error('Error fetching categories:', error);
        return res.status(500).json({ success: false, message: 'Server error.' });
    }
};

module.exports = {
  addAppointment,
  getAppointments,
  admitPatient,
  removePatient,
  fetchPatients
};
