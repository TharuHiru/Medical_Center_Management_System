const admin = require("firebase-admin");
const serviceAccount = require("./firebase-admin.json"); // 🔹 Import your JSON file

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const firestore = admin.firestore();

module.exports = firestore;
