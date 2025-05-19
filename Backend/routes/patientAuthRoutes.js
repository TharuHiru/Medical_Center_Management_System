const express = require('express');
const router = express.Router();
const patientAuthController = require('../controllers/patientAuthController');

router.post('/send-verification', patientAuthController.sendVerification);
router.post('/verify-code', patientAuthController.verifyCode);
router.post('/set-password', patientAuthController.setPassword);
router.post('/login', patientAuthController.login);
router.get('/fetch-patient-IDs/:master_ID', patientAuthController.fetchPatientIDs);
router.get('/fetch-appointment-details/:patient_ID', patientAuthController.fetchAppointments);
router.get('/fetch-patient-profile/:patient_ID', patientAuthController.fetchPatientProfile);

module.exports = router;
