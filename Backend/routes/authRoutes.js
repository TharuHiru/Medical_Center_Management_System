const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Doctor Register Step 1
router.post('/register/step1', authController.registerStep1);

// Doctor Register Step 2
router.post('/register/step2', authController.registerStep2);

// Doctor Login
router.post('/doctor-login', authController.doctorLogin);

// Temporary Patient Signup
router.post('/tempory-patient-signup', authController.tempPatientSignup);

// Assistant Register
router.post('/register-assistant', authController.registerAssistant);

// Assistant Login
router.post('/assistant-login', authController.assistantLogin);

// Fetch Master Accounts for patients
router.get('/master-accounts', authController.fetchMasterAccounts);

module.exports = router;
