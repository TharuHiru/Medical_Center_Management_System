const express = require('express');
const pool = require('../config/db');
const router = express.Router();

//Get all patients list
router.get('/fetch-assistants', async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT NIC,Title,First_Name,Last_Name,Contact_Number,House_No,Address_Line_1,Address_Line_2 FROM assistant");
        
        // Log fetched data
        console.log('Fetched Assistants:', rows);

        return res.status(200).json({ success: true, data: rows });
    } catch (error) {
        console.error('Error fetching Assistants:', error);
        return res.status(500).json({ success: false, message: 'Server error.' });
    }
});

module.exports = router;