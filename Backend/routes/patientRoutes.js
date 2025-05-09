const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');

router.get('/fetch-patients', patientController.fetchPatients);
router.put('/updatePatient', patientController.updatePatient);

module.exports = router;
