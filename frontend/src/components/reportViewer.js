import { useState } from 'react';
import { fetchReport } from '@/services/reportService';
import "@/Styles/reportViewer.css"

const ReportViewer = () => {
  const [reportType, setReportType] = useState('daily-appointments');
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

  const renderReport = () => {
    if (!reportData) return <p>No report generated yet</p>;
    
    switch(reportType) {
      case 'daily-appointments':
        return (
          <div>
            <h3>Daily Appointments Report ({dateRange.startDate} to {dateRange.endDate})</h3>
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Total Appointments</th>
                  <th>Unique Patients</th>
                </tr>
              </thead>
              <tbody>
                {reportData.map((row, index) => (
                  <tr key={index}>
                    <td>{row.date}</td>
                    <td>{row.total_appointments}</td>
                    <td>{row.unique_patients}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case 'monthly-revenue-summary':
        return (
          <div>
            <h3>Monthly Revenue Summary ({dateRange.startDate} to {dateRange.endDate})</h3>
            <table className="table">
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Prescriptions</th>
                  <th>Service Charges</th>
                  <th>Medicine Revenue</th>
                  <th>Medicine Profit</th>
                  <th>Total Revenue</th>
                </tr>
              </thead>
              <tbody>
                {reportData.map((row, index) => (
                  <tr key={index}>
                    <td>{row.month}</td>
                    <td>{row.prescriptionsCount}</td>
                    <td>${(Number(row.totalServiceCharges) || 0).toFixed(2)}</td>                    
                    <td>${row.medicineRevenue.toFixed(2)}</td>
                    <td>${row.medicineProfit.toFixed(2)}</td>
                    <td>${row.totalRevenue.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
              {reportData.length > 1 && (
                <tfoot>
                  <tr>
                    <th>Total</th>
                    <th>{reportData.reduce((sum, row) => sum + row.prescriptionsCount, 0)}</th>
                    <th>${reportData.reduce((sum, row) => sum + row.totalServiceCharges, 0).toFixed(2)}</th>
                    <th>${reportData.reduce((sum, row) => sum + row.medicineRevenue, 0).toFixed(2)}</th>
                    <th>${reportData.reduce((sum, row) => sum + row.medicineProfit, 0).toFixed(2)}</th>
                    <th>${reportData.reduce((sum, row) => sum + row.totalRevenue, 0).toFixed(2)}</th>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        );
      case 'detailed-medicine-sales':
        return (
          <div>
            <h3>Detailed Medicine Sales ({dateRange.startDate} to {dateRange.endDate})</h3>
            <table className="table">
              <thead>
                <tr>
                  <th>Medicine</th>
                  <th>Brand</th>
                  <th>Units Sold</th>
                  <th>Total Cost</th>
                  <th>Total Revenue</th>
                  <th>Total Profit</th>
                  <th>Profit Margin</th>
                </tr>
              </thead>
              <tbody>
                {reportData.map((row, index) => (
                  <tr key={index}>
                    <td>{row.medicineName}</td>
                    <td>{row.brandName}</td>
                    <td>{row.unitsSold}</td>
                    <td>${(Number(row.totalCost) || 0).toFixed(2)}</td>
                    <td>${(Number(row.totalRevenue) || 0).toFixed(2)}</td>
                    <td>${(Number(row.totalProfit) || 0).toFixed(2)}</td>
                    <td>{row.profitMargin}%</td>
                  </tr>
                ))}
              </tbody>
              {reportData.length > 1 && (
                <tfoot>
                  <tr>
                    <th colSpan="2">Total</th>
                    <th>{reportData.reduce((sum, row) => sum + row.unitsSold, 0)}</th>
                    <th>${reportData.reduce((sum, row) => sum + row.totalCost, 0).toFixed(2)}</th>
                    <th>${reportData.reduce((sum, row) => sum + row.totalRevenue, 0).toFixed(2)}</th>
                    <th>${reportData.reduce((sum, row) => sum + row.totalProfit, 0).toFixed(2)}</th>
                    <th>
                      {(
                        (reportData.reduce((sum, row) => sum + row.totalProfit, 0) / 
                        reportData.reduce((sum, row) => sum + row.totalRevenue, 0)) * 100
                      ).toFixed(2)}%
                    </th>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        );
      default:
        return <p>Select a report type</p>;
    }
  };

  return (
    <div className="container">
      <h2>Medical Center Reports</h2>
      
      <div className="mb-3">
        <label className="form-label">Report Type:</label>
        <select 
          className="form-select"
          value={reportType}
          onChange={(e) => setReportType(e.target.value)}
        >
          <option value="daily-appointments">Daily Appointments</option>
          <option value="monthly-revenue-summary">Monthly Revenue Summary</option>
          <option value="detailed-medicine-sales">Detailed Medicine Sales</option>
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
      
      {renderReport()}
    </div>
  );
};

export default ReportViewer;