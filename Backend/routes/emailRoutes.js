const express = require('express');
const router = express.Router();
const emailController = require('../controllers/emailController');

// Send prescription email
router.post('/prescriptions', emailController.sendPrescriptionEmail);
router.post('/receipts', emailController.sendReceiptEmail);

// Generate PDF endpoints
router.post('/generate-pdf', emailController.generatePdf);

router.get('/:patientId/email', emailController.getPatientEmail);

module.exports = router;