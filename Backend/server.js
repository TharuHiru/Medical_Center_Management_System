// Use to load the evnvironment files from the .env file to process.env
require('dotenv').config(); 

//import express to create a server instance
const express = require('express');

//use to parse the body of the request
const bodyParser = require('body-parser');
const app = express();

//use to listen to the port 3000
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

//allow frontend to access the backend
const cors = require('cors');

app.use(cors({
    origin: 'http://localhost:3000', // Allow frontend domain
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'], // ✅ Allow Content-Type
    credentials: true // Enable cookies
}));

// Handle preflight OPTIONS request
app.options('*', cors());


// Import the auth routes (to register doctor , assistant and the patient)
const authRoutes = require('./routes/authRoutes');
const patientRoutes = require('./routes/patientRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const assistantRoutes = require('./routes/inventoryRoutes');
const patientAuthRoutes = require('./routes/patientAuthRoutes');



app.use('/api/auth', authRoutes); // Prefix all auth routes with /api/auth
app.use('/api/patients', patientRoutes); // Prefix all patient routes with /api/patients
app.use('/api/inventory', inventoryRoutes); // Prefix all patient routes with /api/inventory
app.use('/api/assistant', assistantRoutes); // Prefix all patient routes with /api/inventory
app.use('/api/patientAuth', patientAuthRoutes);

app.listen(port, () => {
    console.log(`🚀 Server is running on http://localhost:${port}`);
});