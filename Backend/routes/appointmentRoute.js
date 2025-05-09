const express = require("express");
const router = express.Router();
const appointmentController = require("../controllers/appointmentController");

router.post("/", appointmentController.addAppointment);
router.get("/doctor-view", appointmentController.getAppointments);
router.put("/admit", appointmentController.admitPatient);
router.delete("/remove", appointmentController.removePatient);

module.exports = router;
