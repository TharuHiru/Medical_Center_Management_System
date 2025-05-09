const express = require('express');
const router = express.Router();

const billingController = require('../controllers/billingController');

// get inventory by medicine ID
router.get('/getInventoryByMedicineID/:medicine_ID', billingController.getInventoryByMedicineID);

// save payment and billing
router.post('/savePatmentBill', billingController.savePaymentBill);

module.exports = router;
