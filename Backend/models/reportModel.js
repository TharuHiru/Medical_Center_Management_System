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

  getMonthlyRevenueSummary: async (startDate, endDate) => {
  const [results] = await db.query(`
    SELECT 
      DATE_FORMAT(p.Date, '%Y-%m') AS month,
      COUNT(DISTINCT p.prescription_ID) AS prescriptionsCount,
      COALESCE(SUM(DISTINCT pay.service_charge), 0) AS totalServiceCharges,
      COALESCE(SUM(ib.amount), 0) AS medicineRevenue,
      COALESCE(SUM(ib.No_of_units * (mi.unit_price - mi.buying_price)), 0) AS medicineProfit,
      COALESCE(SUM(DISTINCT pay.service_charge), 0) + COALESCE(SUM(ib.amount), 0) AS totalRevenue
    FROM 
      prescription p
    JOIN 
      payments pay ON p.prescription_ID = pay.prescription_ID
    LEFT JOIN 
      inventory_billing ib ON pay.payment_ID = ib.payment_ID
    LEFT JOIN 
      medicine_inventory mi ON ib.Inventory_ID = mi.inventory_ID
    WHERE 
      p.Date BETWEEN ? AND ?
    GROUP BY 
      DATE_FORMAT(p.Date, '%Y-%m')
    ORDER BY 
      month`, [startDate, endDate]);
  
  // Ensure all numeric fields are properly converted to numbers
  return results.map(row => ({
    ...row,
    prescriptionsCount: Number(row.prescriptionsCount),
    totalServiceCharges: Number(row.totalServiceCharges),
    medicineRevenue: Number(row.medicineRevenue),
    medicineProfit: Number(row.medicineProfit),
    totalRevenue: Number(row.totalRevenue)
  }));
},
  getDetailedMedicineSales: async (startDate, endDate) => {
  const [results] = await db.query(`
    SELECT 
      mc.medicine_Name AS medicineName,
      mcb.Brand_Name AS brandName,
      SUM(ib.No_of_units) AS unitsSold,
      SUM(ib.No_of_units * mi.buying_price) AS totalCost,
      SUM(ib.amount) AS totalRevenue,
      SUM(ib.amount - (ib.No_of_units * mi.buying_price)) AS totalProfit,
      ROUND(
        (SUM(ib.amount - (ib.No_of_units * mi.buying_price)) / 
        NULLIF(SUM(ib.amount), 0)) * 100, 
        2
      ) AS profitMargin
    FROM 
      prescription p
    JOIN 
      payments pay ON p.prescription_ID = pay.prescription_ID
    JOIN 
      inventory_billing ib ON pay.payment_ID = ib.payment_ID
    JOIN 
      medicine_inventory mi ON ib.Inventory_ID = mi.inventory_ID
    JOIN 
      medicine_category mc ON mi.medicine_ID = mc.medicine_ID
    JOIN 
      medicine_category_brand mcb ON mi.Brand_ID = mcb.brand_ID
    WHERE 
      p.Date BETWEEN ? AND ?
      AND p.status != 'Not billed'
    GROUP BY 
      mc.medicine_Name, mcb.Brand_Name
    ORDER BY 
      totalProfit DESC`, [startDate, endDate]);
  
  return results;
}
};

module.exports = Report;