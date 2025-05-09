const pool = require('../config/db');

exports.getPatientById = async (patientId) => {
  const [rows] = await pool.query("SELECT firstName, lastName FROM patients WHERE patient_ID = ?", [patientId]);
  return rows[0];
};

exports.insertPrescription = async (data) => {
  const [result] = await data.connection.query(
    "INSERT INTO prescription (prescription_ID, Date, Diagnosis, patient_ID, doctor_ID, other, appointment_ID, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [data.prescription_ID, data.date, data.diagnosis, data.patient_ID, data.doctor_ID, data.otherNotes, data.appointment_ID, data.status]
  );
  return result;
};

exports.getMedicineIdByName = async (connection, name) => {
  const [rows] = await connection.query("SELECT medicine_ID FROM medicine_category WHERE medicine_Name = ?", [name]);
  return rows[0];
};

exports.insertPrescriptionMedicine = async (connection, prescription_ID, medicine_ID, dosage) => {
  return connection.query(
    "INSERT INTO prescription_medicine (prescription_ID, medicine_ID, Dosage) VALUES (?, ?, ?)",
    [prescription_ID, medicine_ID, dosage]
  );
};

exports.getAllergies = async (patientId) => {
  const [rows] = await pool.query("SELECT allergies FROM patients WHERE patient_ID = ?", [patientId]);
  return rows[0];
};

exports.updateAllergies = async (patientId, allergies) => {
  return pool.query("UPDATE patients SET allergies = ? WHERE patient_ID = ?", [allergies, patientId]);
};
