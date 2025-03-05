const express = require('express');
const pool = require('../config/db');

const router = express.Router();

// Register Inventory
router.post('/register-inventory', async (req, res) => {
    console.log("Received Inventory Data:", req.body);

    const { name, batch_no, exp_date, stock_quantity, unit_price, buying_price } = req.body;

    // Check if all required fields are provided
    if (!name || !batch_no || !exp_date || !stock_quantity || !unit_price || !buying_price) {
        return res.status(400).json({ success: false, message: 'Please fill all the values' });
    }

    try {
        // Check if the inventory item with the same batch number already exists
        const [rows] = await pool.query("SELECT * FROM medicine WHERE batch_no = ?", [batch_no]);
        if (rows.length > 0) {
            return res.status(400).json({ success: false, message: 'Inventory item already exists' });
        }

        // Insert new inventory record
        const query = `INSERT INTO medicine (name, batch_no, exp_date, stock_quantity, unit_price, buying_price) 
                       VALUES (?, ?, ?, ?, ?, ?)`;
        await pool.query(query, [name, batch_no, exp_date, stock_quantity, unit_price, buying_price]);

        console.log("Inventory item registered:", name, batch_no);
        return res.status(201).json({ success: true, message: 'Inventory added successfully' });
    } catch (error) {
        console.error('Error inserting inventory:', error);
        return res.status(500).json({ success: false, message: 'Server error.' });
    }
});

module.exports = router;