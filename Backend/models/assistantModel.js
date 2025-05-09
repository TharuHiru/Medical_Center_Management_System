const pool = require('../config/db');

const getAllAssistants = async () => {
    const [rows] = await pool.query("SELECT * FROM assistant");
    return rows;
};

module.exports = {
    getAllAssistants,
};
