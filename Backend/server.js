// Load environment variables from .env file
require('dotenv').config(); 

// Import required packages
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// Initialize Express app
const app = express();
const port = process.env.PORT || 3000;

// Middleware setup
app.use(bodyParser.json());
app.use(cors({
    origin: 'http://localhost:3000', // Allow frontend domain
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// Handle preflight OPTIONS request
app.options('*', cors());

// ✅ Firestore setup
const firestore = require("./config/firebase");

firestore
  .collection("test")
  .limit(1)
  .get()
  .then(() => {
    console.log("🔥 Firestore connected successfully!");
  })
  .catch((error) => {
    console.error("❌ Firestore connection failed:", error);
  });

// ✅ Import Routes
const authRoutes = require('./routes/authRoutes');
const patientRoutes = require('./routes/patientRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const assistantRoutes = require('./routes/assistantRoutes'); 
const patientAuthRoutes = require('./routes/patientAuthRoutes');
const billingRoutes = require('./routes/billingRoutes');
const appointmentRoutes = require('./routes/appointmentRoute');
const prescriptionRoutes = require('./routes/prescriptionRoutes');
const temporyPatientRoutes = require('./routes/temporyPatientRoutes');
const dashboardRoutes = require("./routes/dashboardRoutes");
const reportsRoutes = require ("./routes/reportRoute");
const emailRoutes = require ("./routes/emailRoutes");

// ✅ Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/assistant', assistantRoutes); 
app.use('/api/patientAuth', patientAuthRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/temporyPatientAuth', temporyPatientRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/reports", reportsRoutes);
app.use ("/api/emails" , emailRoutes);

// ✅ Start Server
app.listen(port, () => {
    console.log(`🚀 Server is running on http://localhost:${port}`);
});
