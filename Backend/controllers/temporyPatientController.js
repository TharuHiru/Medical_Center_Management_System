const bcrypt = require('bcryptjs');
const firestore = require("../config/firebase");

const addTemporyPatient = async (req, res) => {
  try {
    const { name, address, phone, password } = req.body;

    if (!name || !address || !phone || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

const docRef = firestore.collection("temporypatint").doc(phone);
    const existingDoc = await docRef.get();

    if (existingDoc.exists) {
      return res.status(409).json({ success: false, message: "Phone number already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await docRef.set({
      name,
      address,
      phone,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
    });

    return res.status(200).json({ success: true, message: "Temporary patient registered successfully" });

  } catch (error) {
    console.error("Error adding patient:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { addTemporyPatient };
