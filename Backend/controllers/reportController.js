const Report = require('../models/reportModel');

exports.getReport = async (req, res) => {
  try {
    const { reportType, startDate, endDate } = req.body;
    
    let data;
    switch(reportType) {
      case 'daily-appointments':
        data = await Report.getDailyAppointments(startDate, endDate);
        break;
      case 'monthly-revenue-summary':
        data = await Report.getMonthlyRevenueSummary(startDate, endDate);
        break;
      case 'detailed-medicine-sales':
        data = await Report.getDetailedMedicineSales(startDate, endDate);
        break;
      default:
        return res.status(400).json({ success: false, error: 'Invalid report type' });
    }
    
    res.json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};