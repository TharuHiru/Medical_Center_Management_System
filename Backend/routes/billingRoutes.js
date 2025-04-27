const express = require('express');
const pool = require('../config/db');
const db = require("../config/firebase"); // Firestore database
require('dotenv').config();
const router = express.Router();

// function to get inventory details from the medicine ID, including brand name
router.get('/getInventoryByMedicineID/:medicine_ID', async (req, res) => {
    const { medicine_ID } = req.params;
    console.log("Received Medicine ID:", medicine_ID);

    try {
        const [inventory] = await pool.query(
            `SELECT mi.*, b.Brand_Name
             FROM medicine_inventory mi
             JOIN medicine_category_brand b ON mi.Brand_ID = b.brand_ID
             WHERE mi.medicine_ID = ?`, 
            [medicine_ID]
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

// Add payment and billing
router.post('/savePatmentBill', async (req, res) => {
    const { prescriptionId, serviceCharge, medicines } = req.body;
    console.log("Received Payment Data:", req.body);

    const paymentID = Math.floor(100000 + Math.random() * 900000);
    console.log("Generated Payment ID:", paymentID);

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // Insert into payments with only service charge first
        await connection.query(
            `INSERT INTO payments (payment_ID, service_charge, full_amount, prescription_ID)
             VALUES (?, ?, ?, ?)`,
            [paymentID, serviceCharge, 0, prescriptionId] // Initially set full_amount to 0
        );

        let totalMedicineCost = 0; // Track total cost of medicines

        // Insert into inventory_billing for each medicine
        for (const medicine of medicines) {
            const [inventoryResult] = await connection.query(
                `SELECT unit_price, stock_quantity 
                FROM medicine_inventory 
                WHERE inventory_ID = ?`,
                [medicine.inventory_ID]
            );

            if (inventoryResult.length === 0) {
                throw new Error(`Inventory ID ${medicine.inventory_ID} not found`);
            }

            const unitPrice = inventoryResult[0].unit_price;
            const currentUnits = inventoryResult[0].stock_quantity;

            if (medicine.units > currentUnits) {
                throw new Error(`Not enough stock for Inventory ID ${medicine.inventory_ID}. Available: ${currentUnits}, Requested: ${medicine.units}`);
            }

            const amount = unitPrice * medicine.units;
            totalMedicineCost += amount; // Add to total

            console.log('Medicine:', medicine.inventory_ID, 'Amount:', amount);
            console.log('Current total medicine cost:', totalMedicineCost);

            await connection.query(
                `INSERT INTO inventory_billing (payment_ID, Inventory_ID, No_of_units, amount)
                VALUES (?, ?, ?, ?)`,
                [paymentID, medicine.inventory_ID, medicine.units, amount]
            );

            const newAvailableUnits = currentUnits - medicine.units;
            await connection.query(
                `UPDATE medicine_inventory 
                SET stock_quantity = ? 
                WHERE inventory_ID = ?`,
                [newAvailableUnits, medicine.inventory_ID]
            );
        }
        // Now update the full amount in the payments table
        const finalFullAmount = parseFloat(serviceCharge) + parseFloat(totalMedicineCost);
        await connection.query(
            `UPDATE payments 
            SET full_amount = ? 
            WHERE payment_ID = ?`,
            [finalFullAmount, paymentID]
        );
                await connection.commit();
                console.log("Inserted Payment ID:", paymentID);
                res.status(200).json({ success: true, message: 'Payment and billing added successfully', paymentID: paymentID });

            } catch (error) {
                await connection.rollback();
                console.error('Error adding payment and billing:', error.message);
                res.status(500).json({ success: false, message: error.message });
            } finally {
                connection.release();
            }
        });

        module.exports = router;
