const Report = require('../models/reportModel');

exports.getRevenueReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.body;
    
    if (!startDate || !endDate) {
      return res.status(400).json({ 
        success: false, 
        error: 'Start date and end date are required' 
      });
    }

    const reportData = await Report.getRevenueProfitAnalysis(startDate, endDate);
    
    res.json({ 
      success: true, 
      data: reportData 
    });
  } catch (error) {
    console.error('Error in getRevenueReport:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Server error',
      message: error.message 
    });
  }
};

module.exports = exports;