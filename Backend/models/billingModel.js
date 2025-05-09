
const pool = require('../config/db');
const db = require('../config/firebase'); // Firestore database

// Function to get inventory details by medicine ID
const getInventoryByMedicineID = async (medicine_ID) => {
    try {
        const [inventory] = await pool.query(
            `SELECT mi.*, b.Brand_Name
             FROM medicine_inventory mi
             JOIN medicine_category_brand b ON mi.Brand_ID = b.brand_ID
             WHERE mi.medicine_ID = ?`, 
            [medicine_ID]
        );
        return inventory;
    } catch (error) {
        throw new Error('Error fetching inventory: ' + error.message);
    }
};

// Function to save payment and billing details
const savePaymentBill = async (prescriptionId, serviceCharge, medicines) => {
    const paymentID = Math.floor(100000 + Math.random() * 900000);
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // Insert into payments with only service charge first
        await connection.query(
            `INSERT INTO payments (payment_ID, service_charge, full_amount, prescription_ID)
             VALUES (?, ?, ?, ?)`,
            [paymentID, serviceCharge, 0, prescriptionId] // Initially set full_amount to 0
        );

        let totalMedicineCost = 0;

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
            totalMedicineCost += amount;

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

        const finalFullAmount = parseFloat(serviceCharge) + parseFloat(totalMedicineCost);
        await connection.query(
            `UPDATE payments 
            SET full_amount = ? 
            WHERE payment_ID = ?`,
            [finalFullAmount, paymentID]
        );

        await connection.commit();

        // Delete the prescription document from Firebase Firestore
        const prescriptionRef = db.collection('prescriptions').doc(prescriptionId);
        await prescriptionRef.delete();

        return { success: true, paymentID };
    } catch (error) {
        await connection.rollback();
        throw new Error('Error adding payment and billing: ' + error.message);
    } finally {
        connection.release();
    }
};

module.exports = {
    getInventoryByMedicineID,
    savePaymentBill
};
