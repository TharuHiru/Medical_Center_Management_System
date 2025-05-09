const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');

//Add new inventory record
router.post('/register-inventory', inventoryController.registerInventory);

//Fetch all inventory records
router.get('/fetch-inventory', inventoryController.fetchInventory);

//Fetch all medicine categories
router.get('/fetch-medicine-category', inventoryController.fetchMedicineCategory);

//add new medicine category
router.post('/add-medicine-category', inventoryController.addMedicineCategory);

//add new medicine brands
router.post('/add-medicine-brand', inventoryController.addMedicineBrand);

//fetch all medicine brands
router.get('/fetch-brand-names', inventoryController.fetchBrandNames);

module.exports = router;
