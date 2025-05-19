const db = require('../config/db');

const Report = {
  getRevenueProfitAnalysis: async (startDate, endDate) => {
    try {
      // 1. Consultation Summary
      const [consultationSummary] = await db.query(`
        SELECT 
          COUNT(DISTINCT p.prescription_ID) AS totalAppointments,
          SUM(pay.service_charge) AS totalRevenue,
          ROUND(AVG(pay.service_charge), 2) AS averageFee
        FROM 
          prescription p
        JOIN 
          payments pay ON p.prescription_ID = pay.prescription_ID
        WHERE 
          p.Date BETWEEN ? AND ?
          AND p.status != 'Not billed'
      `, [startDate, endDate]);

      // 2. Medicine Sales Summary
      const [medicineSalesSummary] = await db.query(`
        SELECT 
          SUM(ib.No_of_units) AS totalUnitsSold,
          SUM(ib.amount) AS totalRevenue,
          SUM(ib.No_of_units * mi.buying_price) AS totalCost,
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
        WHERE 
          p.Date BETWEEN ? AND ?
          AND p.status != 'Not billed'
      `, [startDate, endDate]);

      // 3. Detailed Medicine Sales Breakdown
      const [medicineDetails] = await db.query(`
        SELECT 
          mc.medicine_Name AS medicineName,
          COALESCE(mcb.Brand_Name, 'No Brand') AS brandName,
          SUM(ib.No_of_units) AS unitsSold,
          SUM(ib.amount) AS revenue,
          SUM(ib.No_of_units * mi.buying_price) AS cost,
          SUM(ib.amount - (ib.No_of_units * mi.buying_price)) AS profit,
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
        LEFT JOIN 
          medicine_category_brand mcb ON mi.Brand_ID = mcb.brand_ID
        WHERE 
          p.Date BETWEEN ? AND ?
          AND p.status != 'Not billed'
        GROUP BY 
          mc.medicine_Name, mcb.Brand_Name
        ORDER BY 
          revenue DESC
      `, [startDate, endDate]);

      return {
        consultationSummary: consultationSummary[0],
        medicineSalesSummary: medicineSalesSummary[0],
        medicineDetails,
      };

    } catch (error) {
      console.error('Error in getRevenueProfitAnalysis:', error);
      throw error;
    }
  }
};

module.exports = Report;