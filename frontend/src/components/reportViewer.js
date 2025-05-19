import { useState } from 'react';
import { fetchReport } from '@/services/reportService';
import "@/Styles/reportViewer.css"

const ReportViewer = () => {
  const [reportType, setReportType] = useState('revenue-profit-analysis');
  const [dateRange, setDateRange] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [reportData, setReportData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateReport = async () => {
    setIsLoading(true);
    try {
      const result = await fetchReport(reportType, dateRange);
      setReportData(result.data);
    } catch (error) {
      alert('Error generating report');
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (value) => `$${Number(value || 0).toFixed(2)}`;
  const formatPercent = (value) => `${Number(value || 0).toFixed(2)}%`;

  const renderReport = () => {
    if (!reportData) return <p>No report generated yet</p>;
    
    return (
      <div className="report-container printable">
        <div className="report-header">
          <h2>Medical Center - Revenue & Profit Analysis</h2>
          <p className="report-period">
            Period: {new Date(dateRange.startDate).toLocaleDateString()} to {new Date(dateRange.endDate).toLocaleDateString()}
          </p>
          <p className="report-generated">
            Generated on: {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
          </p>
        </div>
        
        {/* 1. Consultation Summary */}
        <div className="section-container">
          <h3 className="section-title">Consultation Summary</h3>
          <div className="summary-cards">
            <div className="summary-card">
              <h4>Total Appointments</h4>
              <p className="amount">{reportData.consultationSummary.totalAppointments}</p>
            </div>
            <div className="summary-card">
              <h4>Total Revenue</h4>
              <p className="amount">{formatCurrency(reportData.consultationSummary.totalRevenue)}</p>
            </div>
            <div className="summary-card">
              <h4>Average Fee</h4>
              <p className="amount">{formatCurrency(reportData.consultationSummary.averageFee)}</p>
            </div>
          </div>
        </div>
        
        {/* 2. Medicine Sales Summary */}
        <div className="section-container">
          <h3 className="section-title">Medicine Sales Summary</h3>
          <div className="summary-cards">
            <div className="summary-card">
              <h4>Total Units Sold</h4>
              <p className="amount">{reportData.medicineSalesSummary.totalUnitsSold}</p>
            </div>
            <div className="summary-card">
              <h4>Total Revenue</h4>
              <p className="amount">{formatCurrency(reportData.medicineSalesSummary.totalRevenue)}</p>
            </div>
            <div className="summary-card">
              <h4>Total Profit</h4>
              <p className="amount">{formatCurrency(reportData.medicineSalesSummary.totalProfit)}</p>
            </div>
            <div className="summary-card">
              <h4>Profit Margin</h4>
              <p className="amount">{formatPercent(reportData.medicineSalesSummary.profitMargin)}</p>
            </div>
          </div>
        </div>
        
        {/* 3. Detailed Medicine Sales */}
        <div className="section-container">
          <h3 className="section-title">Detailed Medicine Sales</h3>
          <table className="report-table">
            <thead>
              <tr>
                <th>Medicine</th>
                <th>Brand</th>
                <th>Units Sold</th>
                <th>Revenue</th>
                <th>Cost</th>
                <th>Profit</th>
                <th>Margin</th>
              </tr>
            </thead>
            <tbody>
              {reportData.medicineDetails.map((medicine, index) => (
                <tr key={index}>
                  <td>{medicine.medicineName}</td>
                  <td>{medicine.brandName}</td>
                  <td>{medicine.unitsSold}</td>
                  <td>{formatCurrency(medicine.revenue)}</td>
                  <td>{formatCurrency(medicine.cost)}</td>
                  <td>{formatCurrency(medicine.profit)}</td>
                  <td>{formatPercent(medicine.profitMargin)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="report-footer">
          <button className="btn btn-secondary print-btn" onClick={() => window.print()}>
            Print Report
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="container">
      <h2>Medical Center Reports</h2>
      
      <div className="report-controls">
        <div className="mb-3">
          <label className="form-label">Report Type:</label>
          <select 
            className="form-select"
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
          >
            <option value="revenue-profit-analysis">Revenue & Profit Analysis</option>
            <option value="inventory-status">Inventory Status Report</option>
          </select>
        </div>
        
        <div className="row mb-3">
          <div className="col">
            <label className="form-label">Start Date:</label>
            <input 
              type="date" 
              className="form-control"
              value={dateRange.startDate}
              onChange={(e) => setDateRange({...dateRange, startDate: e.target.value})}
            />
          </div>
          <div className="col">
            <label className="form-label">End Date:</label>
            <input 
              type="date" 
              className="form-control"
              value={dateRange.endDate}
              onChange={(e) => setDateRange({...dateRange, endDate: e.target.value})}
            />
          </div>
        </div>
        
        <button 
          className="btn btn-primary mb-3"
          onClick={handleGenerateReport}
          disabled={isLoading}
        >
          {isLoading ? 'Generating...' : 'Generate Report'}
        </button>
      </div>
      
      {renderReport()}
    </div>
  );
};

export default ReportViewer;