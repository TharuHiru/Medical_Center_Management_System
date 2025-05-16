const pool = require('../config/db');

const getDashboardStats = async () => {
  try {
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

    // Execute all queries in parallel
    const results = await Promise.all(
      queries.map(query => pool.query(query).catch(err => {
        console.error(`Error executing query: ${query}`, err);
        throw err; // Re-throw to be caught by the outer try-catch
      }))
    );

    // Merge all results into one object
    const stats = results.reduce((acc, [rows]) => ({ ...acc, ...rows[0] }), {});

    return stats;
  } catch (error) {
    console.error('Error in getDashboardStats:', error);
    
    // Return a default object with all stats as 0 in case of error
    return {
      totalPatients: 0,
      todaysAppointments: 0,
      totalAppointments: 0,
      availableMedicines: 0,
      outOfStockMedicines: 0,
      totalDoctors: 0,
      unbilledPrescriptions: 0,
      totalPayments: 0,
      temporaryPatients: 0,
      medicineBrands: 0
    };
  }
};

module.exports = {
  getDashboardStats
};