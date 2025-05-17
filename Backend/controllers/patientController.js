const PatientModel = require('../models/patientModel');

// Controller: Fetch all patients
exports.fetchPatients = async (req, res) => {
  try {
    const patients = await PatientModel.getAllPatients();
    console.log('Fetched Patients:', patients);
    res.status(200).json({ success: true, data: patients });
  } catch (error) {
    console.error('Error fetching patients:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// Update patient by ID
exports.updatePatient = async (req, res) => {
  const { patientId } = req.params;
  const patientData = req.body;

  try {
    const result = await PatientModel.updatePatient(patientId, patientData);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Patient not found" });
    }

    res.status(200).json({ success: true, message: "Patient updated successfully",
      data: { patient_ID: patientId, ...patientData }
    });
  } catch (error) {
    console.error("Error updating patient:", error);
    res.status(500).json({ success: false, message: "Error updating patient details" });
  }
};
