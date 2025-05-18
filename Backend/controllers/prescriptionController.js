const db = require("../config/firebase");
const pool = require("../config/db");
const Prescription = require("../models/prescriptionModel");

const generatePrescriptionID = () => `P_${Math.floor(100000 + Math.random() * 900000)}`;

// Add new prescription for a patient (Firestore & MySQL Atomic Transaction)
exports.addPrescription = async (req, res) => {
  const {
    status,
    date,
    diagnosis,
    otherNotes,
    patient_ID,
    Age,
    doctor_ID,
    medicines,
    appointment_ID
  } = req.body;

  if (!diagnosis || !patient_ID || !Array.isArray(medicines) || medicines.length === 0) {
    return res.status(400).json({ success: false, message: "Missing or invalid input data" });
  }

  const connection = await pool.getConnection();
  const prescription_ID = generatePrescriptionID();

  try {
    await connection.beginTransaction();

    // Check if prescription already exists for this appointment
    const existingPrescription = await Prescription.getPrescriptionByAppointmentId(appointment_ID);
    if (existingPrescription) {
      throw new Error("Prescription already exists for this appointment");
    }

    // Fetch patient details
    const patient = await Prescription.getPatientById(patient_ID);
    if (!patient) {
      throw new Error("Patient not found");
    }

    const patientName = `${patient.firstName} ${patient.lastName}`;
    const fixedStatus = "pending";

    // Insert prescription into MySQL
    await Prescription.insertPrescription({
      connection,
      prescription_ID,
      date,
      diagnosis,
      patient_ID,
      doctor_ID,
      otherNotes,
      appointment_ID,
      status: fixedStatus
    });

    // Insert medicines
    for (const med of medicines) {
      const medicine = await Prescription.getMedicineIdByName(connection, med.medicine_Name);
      if (!medicine) {
        throw new Error(`Medicine not found: ${med.medicine_Name}`);
      }

      await Prescription.insertPrescriptionMedicine(connection, prescription_ID, medicine.medicine_ID, med.dosage);
    }

    // Add prescription to Firestore
    await db.collection('prescriptions').doc(prescription_ID).set({
      status: fixedStatus,
      prescription_ID,
      patient_ID,
      patientName,
      date,
      diagnosis,
      Age,
      otherNotes,
      medicines,
      createdAt: new Date()
    });

    await connection.commit();
    res.json({ success: true });

  } catch (err) {
    await connection.rollback();
    console.error("Transaction failed:", err.message);
    res.status(500).json({ success: false, message: err.message });
  } finally {
    connection.release();
  }
};

// Get alllergies for a patient
exports.getAllergiesAndDOB = async (req, res) => {
  const patientId = req.params.patientId;

  if (!patientId) {
    return res.status(400).json({ success: false, message: "Missing patient ID" });
  }

  try {
    const result = await Prescription.getAllergiesAndDOB(patientId);
    if (!result) {
      return res.status(404).json({ success: false, message: "Patient not found" });
    }

    res.json({ success: true, allergies: result.allergies , DOB : result.DOB});
  } catch (error) {
    console.error("Error fetching allergies and DOB :", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

//Edit allergies of a patient
exports.editPatientAllergies = async (req, res) => {
  const patientId = req.params.patientId;
  const { allergies } = req.body;

  if (!patientId || !allergies) {
    return res.status(400).json({ success: false, message: "Missing patient ID or allergies" });
  }

  try {
    await Prescription.updateAllergies(patientId, allergies);
    res.json({ success: true, message: "Allergies updated successfully" });
  } catch (error) {
    console.error("Error updating allergies:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
