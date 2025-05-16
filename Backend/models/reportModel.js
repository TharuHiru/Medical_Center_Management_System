const db = require('../config/db');

const Report = {
  getDailyAppointments: async (startDate, endDate) => {
    const [results] = await db.query(`
      SELECT 
        date, 
        COUNT(appoint_ID) AS total_appointments,
        COUNT(DISTINCT patient_ID) AS unique_patients
      FROM 
        appointment
      WHERE 
        date BETWEEN ? AND ?
      GROUP BY 
        date
      ORDER BY 
        date`, [startDate, endDate]);
    return results;
  },

  getMedicineUsage: async (startDate, endDate) => {
    const [results] = await db.query(`
      SELECT 
        mc.medicine_Name,
        mcb.Brand_Name,
        SUM(pm.No_Of_Units) AS total_units_prescribed,
        SUM(pm.No_Of_Units * mi.unit_price) AS total_value
      FROM 
        prescription_medicine pm
      JOIN 
        medicine_category mc ON pm.medicine_ID = mc.medicine_ID
      JOIN 
        medicine_category_brand mcb ON mc.medicine_ID = mcb.medicine_ID
      JOIN 
        medicine_inventory mi ON mcb.brand_ID = mi.Brand_ID AND mc.medicine_ID = mi.medicine_ID
      JOIN 
        prescription p ON pm.prescription_ID = p.prescription_ID
      WHERE 
        p.Date BETWEEN ? AND ?
      GROUP BY 
        mc.medicine_Name, mcb.Brand_Name
      ORDER BY 
        total_units_prescribed DESC`, [startDate, endDate]);
    return results;
  },

  getMonthlyRevenue: async (startDate, endDate) => {
    const [results] = await db.query(`
      SELECT 
        DATE_FORMAT(p.Date, '%Y-%m') AS month,
        COUNT(p.prescription_ID) AS prescriptions,
        SUM(pay.service_charge) AS total_service_charges,
        COALESCE(SUM(ib.amount), 0) AS total_medicine_sales,
        SUM(pay.service_charge + COALESCE(ib.amount, 0)) AS total_revenue
      FROM 
        prescription p
      JOIN 
        payments pay ON p.prescription_ID = pay.prescription_ID
      LEFT JOIN 
        inventory_billing ib ON pay.payment_ID = ib.payment_ID
      WHERE 
        p.Date BETWEEN ? AND ?
      GROUP BY 
        DATE_FORMAT(p.Date, '%Y-%m')
      ORDER BY 
        month`, [startDate, endDate]);
    return results;
  }
};

module.exports = Report;