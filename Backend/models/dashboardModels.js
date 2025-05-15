const db = require("../models/db");

const getDashboardStats = async () => {
  const queries = [
    "SELECT COUNT(*) AS totalPatients FROM patients",
    "SELECT COUNT(*) AS todaysAppointments FROM appointment WHERE date = CURDATE()",
    "SELECT COUNT(*) AS totalAppointments FROM appointment",
    "SELECT COUNT(DISTINCT medicine_ID) AS availableMedicines FROM medicine_inventory WHERE stock_quantity > 0",
    "SELECT COUNT(*) AS outOfStockMedicines FROM medicine_inventory WHERE stock_quantity = 0",
    "SELECT COUNT(*) AS totalDoctors FROM doctor",
    "SELECT COUNT(*) AS unbilledPrescriptions FROM prescription WHERE status = 'Not billed'",
    "SELECT IFNULL(SUM(full_amount), 0) AS totalPayments FROM payments",
    "SELECT COUNT(*) AS temporaryPatients FROM temporary_patients",
    "SELECT COUNT(*) AS medicineBrands FROM medicine_category_brand"
  ];

  const results = await Promise.all(queries.map(q => db.query(q)));

  // Merge all results into one object
  return results.reduce((acc, [rows]) => ({ ...acc, ...rows[0] }), {});
};

module.exports = {
  getDashboardStats
};
