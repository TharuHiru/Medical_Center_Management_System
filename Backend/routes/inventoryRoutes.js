const express = require('express');
const pool = require('../config/db');
const router = express.Router();

// Register Inventory
router.post('/register-inventory', async (req, res) => {
    console.log("Received Inventory Data:", req.body);

    const { medicine_id, batch_no, exp_date, stock_quantity, unit_price, buying_price } = req.body;

    // Check if all required fields are provided
    if (!medicine_id || !batch_no || !exp_date || !stock_quantity || !unit_price || !buying_price) {
        return res.status(400).json({ success: false, message: 'Please fill all the values' });
    }

    try {
        // Check if the inventory item with the same batch number already exists
        const [rows] = await pool.query("SELECT * FROM medicine_inventory WHERE medicine_ID = ? AND batch_no = ?", [medicine_id,batch_no]);
        if (rows.length > 0) {
            return res.status(400).json({ success: false, message: 'Batch Number for that Medicine already exists' });
        }

        // Insert new inventory record
        const query = `INSERT INTO medicine_inventory (medicine_ID, batch_no, exp_date, stock_quantity, unit_price, buying_price,date_added) 
                       VALUES (?, ?, ?, ?, ?, ? , NOW())`;
        await pool.query(query, [medicine_id, batch_no, exp_date, stock_quantity, unit_price, buying_price]);

        console.log("Inventory item registered:", medicine_id, batch_no);
        return res.status(201).json({ success: true, message: 'Inventory added successfully' });
    } catch (error) {
        console.error('Error inserting inventory:', error);
        return res.status(500).json({ success: false, message: 'Server error.' });
    }
});

// Get all inventory list
router.get('/fetch-inventory', async (req, res) => {
    try {
        // Fetch all inventory items
        const [inventory] = await pool.query("SELECT * FROM medicine_inventory");

        // Fetch medicine names for each inventory item
        for (let item of inventory) {
            const [medicineRow] = await pool.query(
                "SELECT medicine_Name FROM medicine_category WHERE medicine_ID = ?",
                [item.medicine_ID] // Use item.medicine_ID from inventory
            );

            // Attach medicine name to the inventory item
            if (medicineRow.length > 0) {
                item.medicine_Name = medicineRow[0].medicine_Name;
            } else {
                item.medicine_Name = null; // If no match found
            }
        }

        // Log fetched data
        console.log('Fetched Inventory:', inventory);

        return res.status(200).json({ success: true, data: inventory });
    } catch (error) {
        console.error('Error fetching inventory:', error);
        return res.status(500).json({ success: false, message: 'Server error.' });
    }
});


//Get the medicine category list

router.get('/fetch-medicine-category', async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM medicine_category");
        
        // Log fetched data
        console.log('Fetched Inventory:', rows);

        return res.status(200).json({ success: true, data: rows });
    } catch (error) {
        console.error('Error fetching inventory:', error);
        return res.status(500).json({ success: false, message: 'Server error.' });
    }
});


// Add new medicine category
router.post('/add-medicine-category', async (req, res) => {
    console.log("Received Medicine Category Data:", req.body);

    let { medicine_name } = req.body; // because i change this to lowercase
    if (!medicine_name) {
        return res.status(400).json({ success: false, message: 'Please provide a medicine name' });
    }

    medicine_name = medicine_name.toLowerCase();

    try {
        // Check if the category name already exists
        const [rows] = await pool.query("SELECT * FROM medicine_category WHERE LOWER(medicine_Name) = ?", [medicine_name]);
        if (rows.length > 0) {
            return res.status(400).json({ success: false, message: 'Category already exists' });
        }

        // Insert new category 
        await pool.query("INSERT INTO medicine_category (medicine_Name) VALUES (?)", [medicine_name]);

        console.log("New medicine category added:", medicine_name);
        return res.status(201).json({ success: true, message: 'Medicine category added successfully' });
    } catch (error) {
        console.error('Error inserting medicine category:', error);
        return res.status(500).json({ success: false, message: 'Server error.' });
    }
});

//Add new medicine brand

router.post('/add-medicine-brand', async (req, res) => {
    console.log("Received Medicine Brand Data:", req.body);

    let { brand_name , medicine_ID } = req.body; // because i change this to lowercase
    if (!brand_name) {
        return res.status(400).json({ success: false, message: 'Please provide a brand name' });
    }
    brand_name = brand_name.toLowerCase();
    const brand_ID = '001';

    try {
        // Check if the category name already exists
        const [rows] = await pool.query("SELECT * FROM medicine_category_brand WHERE medicine_ID = ? AND LOWER(Brand_Name) = ? ", [medicine_ID,brand_name]);
        if (rows.length > 0) {
            return res.status(400).json({ success: false, message: 'Brand already exists' });
        }

        // Insert new category 
        await pool.query("INSERT INTO medicine_category_brand (medicine_ID,Brand_Name,brand_ID) VALUES (?,?,?)", [medicine_ID,brand_name,brand_ID]);

        console.log("New medicine category added:", brand_name);
        return res.status(201).json({ success: true, message: 'Medicine category added successfully' });
    } catch (error) {
        console.error('Error inserting medicine category:', error);
        return res.status(500).json({ success: false, message: 'Server error.' });
    }
});
module.exports = router;

//Filter brand names
router.get('/fetch-brand-names', async (req, res) => {
    let { selectedID } = req.query;
    console.log("Received Medicine ID:", selectedID);
    try {
        const [rows] = await pool.query("SELECT Brand_Name FROM medicine_category_brand WHERE medicine_ID = ?", [selectedID]);

        // Log fetched data
        console.log('Fetched Brand Names:', rows);

        return res.status(200).json({ success: true, data: rows });
    } catch (error) {
        console.error('Error fetching brand names:', error);
        return res.status(500).json({ success: false, message: 'Server error.' });
    }
});