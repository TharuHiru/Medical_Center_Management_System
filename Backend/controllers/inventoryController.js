const inventoryModel = require('../models/inventoryModel');

const registerInventory = async (req, res) => {
    console.log("Received Inventory Data:", req.body);
    const { medicine_id, brand_ID, exp_date, stock_quantity, unit_price, buying_price } = req.body;

    if (!medicine_id || !brand_ID || !exp_date || !stock_quantity || !unit_price || !buying_price) {
        return res.status(400).json({ success: false, message: 'Please fill all the values' });
    }

    try {
        await inventoryModel.insertInventory(medicine_id, brand_ID, exp_date, stock_quantity, unit_price, buying_price);
        console.log("Inventory item registered:", medicine_id);
        return res.status(201).json({ success: true, message: 'Inventory added successfully' });
    } catch (error) {
        console.error('Error inserting inventory:', error);
        return res.status(500).json({ success: false, message: 'Server error.' });
    }
};

const fetchInventory = async (req, res) => {
    try {
        const inventory = await inventoryModel.getAllInventory();
        for (const item of inventory) {
            const medicine = await inventoryModel.getMedicineName(item.medicine_ID);
            item.medicine_Name = medicine?.medicine_Name || null;

            const brand = await inventoryModel.getBrandName(item.Brand_ID);
            item.Brand_Name = brand?.Brand_Name || null;
        }

        console.log('Fetched Inventory:', inventory);
        return res.status(200).json({ success: true, data: inventory });
    } catch (error) {
        console.error('Error fetching inventory:', error);
        return res.status(500).json({ success: false, message: 'Server error.' });
    }
};

const fetchMedicineCategory = async (req, res) => {
    try {
        const rows = await inventoryModel.getMedicineCategories();
        console.log('Fetched Categories:', rows);
        return res.status(200).json({ success: true, data: rows });
    } catch (error) {
        console.error('Error fetching categories:', error);
        return res.status(500).json({ success: false, message: 'Server error.' });
    }
};

const addMedicineCategory = async (req, res) => {
    console.log("Received Medicine Category Data:", req.body);
    let { medicine_name } = req.body;

    if (!medicine_name) {
        return res.status(400).json({ success: false, message: 'Please provide a medicine name' });
    }

    medicine_name = medicine_name.toLowerCase();

    try {
        const exists = await inventoryModel.categoryExists(medicine_name);
        if (exists) {
            return res.status(400).json({ success: false, message: 'Category already exists' });
        }

        await inventoryModel.insertMedicineCategory(medicine_name);
        console.log("New medicine category added:", medicine_name);
        return res.status(201).json({ success: true, message: 'Medicine category added successfully' });
    } catch (error) {
        console.error('Error inserting medicine category:', error);
        return res.status(500).json({ success: false, message: 'Server error.' });
    }
};

const addMedicineBrand = async (req, res) => {
    console.log("Received Medicine Brand Data:", req.body);
    let { brand_name, medicine_ID } = req.body;

    if (!brand_name) {
        return res.status(400).json({ success: false, message: 'Please provide a brand name' });
    }

    brand_name = brand_name.toLowerCase();

    try {
        const exists = await inventoryModel.brandExists(medicine_ID, brand_name);
        if (exists) {
            return res.status(400).json({ success: false, message: 'Brand already exists' });
        }

        await inventoryModel.insertBrand(medicine_ID, brand_name);
        console.log("New medicine brand added:", brand_name);
        return res.status(201).json({ success: true, message: 'Medicine brand added successfully' });
    } catch (error) {
        console.error('Error inserting medicine brand:', error);
        return res.status(500).json({ success: false, message: 'Server error.' });
    }
};

const fetchBrandNames = async (req, res) => {
    const { selectedID } = req.query;
    console.log("Received Medicine ID:", selectedID);

    try {
        const rows = await inventoryModel.getBrandNames(selectedID);
        console.log('Fetched Brand Names:', rows);
        return res.status(200).json({ success: true, data: rows });
    } catch (error) {
        console.error('Error fetching brand names:', error);
        return res.status(500).json({ success: false, message: 'Server error.' });
    }
};

module.exports = {
    registerInventory,
    fetchInventory,
    fetchMedicineCategory,
    addMedicineCategory,
    addMedicineBrand,
    fetchBrandNames
};
