const express = require('express');
const pool = require('../config/db');
require('dotenv').config();
const router = express.Router();


// function to get inventory details from the medicine ID
router.get('/getInventoryByMedicineID/:medicine_ID', async (req, res) => {
    const { medicine_ID } = req.params;
    console.log("Received Medicine ID:", medicine_ID);
    
    try {
        // Fetch inventory details based on the medicine ID
        const [inventory] = await pool.query("SELECT inventory_ID FROM medicine_inventory WHERE medicine_ID = ?", [medicine_ID]);
    
        if (inventory.length === 0) {
        return res.status(404).json({ success: false, message: 'Inventory not found' });
        }
    
        console.log("Fetched Inventory:", inventory);
        return res.status(200).json({ success: true, data: inventory });
    } catch (error) {
        console.error('Error fetching inventory:', error);
        return res.status(500).json({ success: false, message: 'Server error.' });
    }
    }
);

module.exports = router;

