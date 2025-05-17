const pool = require('../config/db');

// Get all assistants
const getAllAssistants = async () => {
  const [rows] = await pool.query("SELECT * FROM assistant");
  return rows;
};

// Update assistant
const updateAssistant = async (id, data) => {
  const {
    Title,
    First_Name,
    Last_Name,
    Contact_Number,
    House_No,
    Address_Line_1,
    Address_Line_2
  } = data;

  const [result] = await pool.query(`
    UPDATE assistant SET
      Title = ?,
      First_Name = ?,
      Last_Name = ?,
      Contact_Number = ?,
      House_No = ?,
      Address_Line_1 = ?,
      Address_Line_2 = ?
    WHERE assist_ID = ?
  `, [Title, First_Name, Last_Name, Contact_Number, House_No, Address_Line_1, Address_Line_2, id]);

  return result;
};

module.exports = {
  getAllAssistants,
  updateAssistant
};
