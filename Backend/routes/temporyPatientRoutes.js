const express = require('express');
const router = express.Router();
const controller = require('../controllers/temporyPatientController');

router.post("/register", controller.addTemporyPatient);

module.exports = router;
