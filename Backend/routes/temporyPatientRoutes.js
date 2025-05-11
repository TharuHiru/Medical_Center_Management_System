const express = require('express');
const router = express.Router();
const controller = require('../controllers/temporyPatientController');

router.post("/register", controller.addTemporyPatient);
router.post("/login", controller.loginTemporyPatient);


module.exports = router;
