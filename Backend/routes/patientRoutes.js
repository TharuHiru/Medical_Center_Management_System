const express = require('express');
const pool = require('../config/db');
const router = express.Router();

router.get('/fetch-patients', async (res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM patients");
        
        // Log fetched data
        console.log('Fetched Patients:', rows);

        return res.status(200).json({ success: true, data: rows });
    } catch (error) {
        console.error('Error fetching patients:', error);
        return res.status(500).json({ success: false, message: 'Server error.' });
    }
});

module.exports = router;
