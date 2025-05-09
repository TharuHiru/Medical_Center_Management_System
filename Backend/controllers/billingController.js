const billingModel = require('../models/billingModel');

// Controller method to get inventory by medicine ID
const getInventoryByMedicineID = async (req, res) => {
    const { medicine_ID } = req.params;

    try {
        const inventory = await billingModel.getInventoryByMedicineID(medicine_ID);

        if (inventory.length === 0) {
            return res.status(404).json({ success: false, message: 'Inventory not found' });
        }

        return res.status(200).json({ success: true, data: inventory });
    } catch (error) {
        console.error('Error fetching inventory:', error);
        return res.status(500).json({ success: false, message: 'Server error.' });
    }
};

// Controller method to save payment and billing
const savePaymentBill = async (req, res) => {
    const { prescriptionId, serviceCharge, medicines } = req.body;

    try {
        const { success, paymentID } = await billingModel.savePaymentBill(prescriptionId, serviceCharge, medicines);

        if (success) {
            return res.status(200).json({
                success: true,
                message: 'Payment and billing added successfully, and prescription deleted from Firestore',
                paymentID: paymentID
            });
        }
    } catch (error) {
        console.error('Error adding payment and billing:', error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getInventoryByMedicineID,
    savePaymentBill
};
