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

// Controller: Update patient
exports.updatePatient = async (req, res) => {
  const { patient_ID, title, firstName, lastName, contactNo, email } = req.body;

  try {
    const result = await PatientModel.updatePatient({ patient_ID, title, firstName, lastName, contactNo, email });

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Patient not found" });
    }

    res.status(200).json({ success: true, message: "Patient updated successfully" });
  } catch (error) {
    console.error("Error updating patient:", error);
    res.status(500).json({ success: false, message: "Error updating patient details" });
  }
};
