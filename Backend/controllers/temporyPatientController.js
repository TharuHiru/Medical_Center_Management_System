const bcrypt = require('bcryptjs');
const firestore = require("../config/firebase");

// temporary signup for patients
const addTemporyPatient = async (req, res) => {
  try { const { name, address, phone } = req.body;

    if (!name || !address || !phone ) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

  const docRef = firestore.collection("temporypatint").doc(phone);
    const existingDoc = await docRef.get();

    if (existingDoc.exists) {
      return res.status(409).json({ success: false, message: "Phone number already registered" });
    }

    await docRef.set({
      name,
      address,
      phone,
      createdAt: new Date().toISOString(),
    });

    return res.status(200).json({ success: true, message: "Temporary patient registered successfully" });

  } catch (error) {
    console.error("Error adding patient:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

//tempory login for patients
const loginTemporyPatient = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ success: false, message: "Phone is required" });
    }

    const docRef = firestore.collection("temporypatint").doc(phone);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return res.status(404).json({ success: false, message: "Patient not found" });
    }

    const patientData = docSnap.data(); // Get the document data

    return res.status(200).json({
      success: true, message: "Login successful",
      data: {
        name: patientData.name || patientData.firstName + ' ' + patientData.lastName,
        phone: patientData.phone,
      },
    });
  } catch (error) {
    console.error("Error logging in patient:", error);
    return res.status(500).json({ 
      success: false,  message: "Server error", error: error.message 
    });
  }
};
module.exports = { addTemporyPatient , loginTemporyPatient };
