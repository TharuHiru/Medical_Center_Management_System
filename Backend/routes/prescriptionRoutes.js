const express = require('express');
const router = express.Router();
const controller = require('../controllers/prescriptionController');

router.post("/addPrescription", controller.addPrescription);
router.get("/getPatientAllergies/:patientId", controller.getPatientAllergies);
router.put("/editPatientAllergies/:patientId", controller.editPatientAllergies);

module.exports = router;
