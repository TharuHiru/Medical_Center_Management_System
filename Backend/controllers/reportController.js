const Report = require('../models/reportModel');

exports.getReport = async (req, res) => {
  try {
    const { reportType, startDate, endDate } = req.body;
    
    let data;
    switch(reportType) {
      case 'daily-appointments':
        data = await Report.getDailyAppointments(startDate, endDate);
        break;
      case 'medicine-usage':
        data = await Report.getMedicineUsage(startDate, endDate);
        break;
      case 'monthly-revenue':
        data = await Report.getMonthlyRevenue(startDate, endDate);
        break;
      default:
        return res.status(400).json({ error: 'Invalid report type' });
    }
    
    res.json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};