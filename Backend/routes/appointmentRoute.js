const db = require("../config/db"); // MySQL Connection
const firestore = require("../config/firebase"); // Firestore

// Book an Appointment (POST)
exports.bookAppointment = async (req, res) => {
  const { patientId, name } = req.body;
  const today = new Date().toISOString().split("T")[0];

  try {
    // Save to MySQL
    const [result] = await db.execute(
      "INSERT INTO appointments (patient_id, date, status) VALUES (?, ?, ?)",
      [patientId, today, "Waiting"]
    );
    const appointmentId = result.insertId;

    // Save to Firestore
    await firestore.collection("appointments").doc(appointmentId.toString()).set({
      patientId,
      name,
      date: today,
      status: "Waiting",
    });

    res.status(201).json({ message: "Appointment booked successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error booking appointment" });
  }
};
