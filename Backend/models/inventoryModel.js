const pool = require('../config/db');

const getNextInventoryID = async () => {
    const [rows] = await pool.query("SELECT inventory_ID FROM medicine_inventory ORDER BY inventory_ID DESC LIMIT 1");

    if (rows.length === 0) {
        return "IN_0000001";
    }

    const lastID = rows[0].inventory_ID;
    const numPart = parseInt(lastID.split('_')[1], 10);
    const nextNum = numPart + 1;
    return `IN_${nextNum.toString().padStart(7, '0')}`;
};

const insertInventory = async (medicine_id, brand_ID, exp_date, stock_quantity, unit_price, buying_price) => {
    const inventory_ID = await getNextInventoryID();
    
    const query = `INSERT INTO medicine_inventory (inventory_ID, medicine_ID, Brand_ID, Exp_Date, stock_quantity, unit_price, buying_price, date_added)
                   VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`;

    return pool.query(query, [inventory_ID, medicine_id, brand_ID, exp_date, stock_quantity, unit_price, buying_price]);
};


const getAllInventory = async () => {
    const [rows] = await pool.query("SELECT * FROM medicine_inventory");
    return rows;
};

const getMedicineName = async (medicine_ID) => {
    const [rows] = await pool.query("SELECT medicine_Name FROM medicine_category WHERE medicine_ID = ?", [medicine_ID]);
    return rows[0];
};

const getBrandName = async (brand_ID) => {
    const [rows] = await pool.query("SELECT Brand_Name FROM medicine_category_brand WHERE brand_ID = ?", [brand_ID]);
    return rows[0];
};

const getMedicineCategories = async () => {
    const [rows] = await pool.query("SELECT * FROM medicine_category");
    return rows;
};

const categoryExists = async (medicine_name) => {
    const [rows] = await pool.query("SELECT * FROM medicine_category WHERE LOWER(medicine_Name) = ?", [medicine_name]);
    return rows.length > 0;
};

const insertMedicineCategory = (medicine_name) => {
    return pool.query("INSERT INTO medicine_category (medicine_Name) VALUES (?)", [medicine_name]);
};

const brandExists = async (medicine_ID, brand_name) => {
    const [rows] = await pool.query("SELECT * FROM medicine_category_brand WHERE medicine_ID = ? AND LOWER(Brand_Name) = ?", [medicine_ID, brand_name]);
    return rows.length > 0;
};

const insertBrand = (medicine_ID, brand_name) => {
    return pool.query("INSERT INTO medicine_category_brand (medicine_ID, Brand_Name) VALUES (?, ?)", [medicine_ID, brand_name]);
};

const getBrandNames = async (medicine_ID) => {
    const [rows] = await pool.query("SELECT brand_ID, Brand_Name FROM medicine_category_brand WHERE medicine_ID = ?", [medicine_ID]);
    return rows;
};

module.exports = {
    insertInventory,
    getAllInventory,
    getMedicineName,
    getBrandName,
    getMedicineCategories,
    categoryExists,
    insertMedicineCategory,
    brandExists,
    insertBrand,
    getBrandNames
};
