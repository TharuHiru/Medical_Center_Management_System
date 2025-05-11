const db = require("../config/firebase"); // Firestore database
const pool = require('../config/db'); // MySQL connection pool

// Add new appointment for a patient (Firestore & MySQL Atomic Transaction - add to Firestore and MySQL)
async function addAppointment(patientID, appointmentDate) {
  const newAppointment = {
    appointmentDate,
    status: "pending", // Default status
    createdAt: new Date(),
  };
  await db.collection("appointments").doc(patientID).set(newAppointment);
}

// Check if appointment exists in Firestore
async function checkAppointmentExists(patientID) {
  const existingAppointment = await db.collection("appointments").doc(patientID).get();
  return existingAppointment.exists && existingAppointment.data().status === "pending";
}

// Get all appointments from Firestore
async function getAppointments() {
  const snapshot = await db.collection("appointments").orderBy("createdAt").get();
  let appointments = [];
  snapshot.forEach((doc) => {
    appointments.push({ id: doc.id, ...doc.data() });
  });
  return appointments;
}

// Admit a patient, update Firestore and MySQL
async function admitPatient(patientID, appointmentDate) {
  const appointmentRef = db.collection("appointments").doc(appointmentDate + "_" + patientID);
  const connection = await pool.getConnection();

  // Generate random appointment ID
  const appointmentID = `A_${Math.floor(100000 + Math.random() * 900000)}`;
  const sqlDate = new Date(appointmentDate).toISOString().split("T")[0]; // YYYY-MM-DD
  const now = new Date();
  const sqlTime = now.toTimeString().slice(0, 8); // HH:mm:ss

  try {
    await connection.beginTransaction();
    await db.runTransaction(async (transaction) => {
      const doc = await transaction.get(appointmentRef);
      if (!doc.exists) {
        throw new Error(`Appointment not found for ID: ${appointmentDate}_${patientID}`);
      }
      transaction.update(appointmentRef, { status: "in progress", appointment_ID: appointmentID });

      const sql = `INSERT INTO appointment (appoint_ID, patient_ID, date, time) VALUES (?, ?, ?, ?)`;
      const [result] = await connection.execute(sql, [appointmentID, patientID, sqlDate, sqlTime]);

      if (result.affectedRows === 0) {
        throw new Error("MySQL insert failed.");
      }
    });
    await connection.commit();
    return appointmentID;
  } catch (error) {
    await connection.rollback();
    throw new Error(error.message);
  } finally {
    connection.release();
  }
}

// Remove a patient from Firestore
async function removePatient(patientID, appointmentDate) {
  const appointmentRef = db.collection("appointments").doc(appointmentDate + "_" + patientID);
  await appointmentRef.delete();
}

//fetch all patients
const fetchPatients = async () => {
    const [rows] = await pool.query("SELECT patient_id , firstName, LastName from patients");
    return rows;
};

module.exports = {
  addAppointment,
  checkAppointmentExists,
  getAppointments,
  admitPatient,
  removePatient,
  fetchPatients,
};
