const express = require('express');
const pool = require('../config/db');
require('dotenv').config();
const router = express.Router();


// function to get inventory details from the medicine ID, including brand name
router.get('/getInventoryByMedicineID/:medicine_ID', async (req, res) => {
    const { medicine_ID } = req.params;
    console.log("Received Medicine ID:", medicine_ID);
    
    try {
        // Fetch inventory details with the associated brand name
        const [inventory] = await pool.query(
            `SELECT mi.*, b.Brand_Name
            FROM medicine_inventory mi
            JOIN medicine_category_brand b ON mi.Brand_ID = b.brand_ID
            WHERE mi.medicine_ID = ?`, [medicine_ID]
        );
    
        if (inventory.length === 0) {
            return res.status(404).json({ success: false, message: 'Inventory not found' });
        }
    
        console.log("Fetched Inventory with Brand Name:", inventory);
        return res.status(200).json({ success: true, data: inventory });
    } catch (error) {
        console.error('Error fetching inventory:', error);
        return res.status(500).json({ success: false, message: 'Server error.' });
    }
});


module.exports = router;

