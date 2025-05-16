import { useState } from 'react';
import { fetchReport } from '@/services/reportService';

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
            <h3>Daily Appointments Report</h3>
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
      case 'medicine-usage':
        return (
          <div>
            <h3>Medicine Usage Report</h3>
            <table className="table">
              <thead>
                <tr>
                  <th>Medicine</th>
                  <th>Brand</th>
                  <th>Units Prescribed</th>
                  <th>Total Value</th>
                </tr>
              </thead>
              <tbody>
                {reportData.map((row, index) => (
                  <tr key={index}>
                    <td>{row.medicine_Name}</td>
                    <td>{row.Brand_Name}</td>
                    <td>{row.total_units_prescribed}</td>
                    <td>{row.total_value.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case 'monthly-revenue':
        return (
          <div>
            <h3>Monthly Revenue Report</h3>
            <table className="table">
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Prescriptions</th>
                  <th>Service Charges</th>
                  <th>Medicine Sales</th>
                  <th>Total Revenue</th>
                </tr>
              </thead>
              <tbody>
                {reportData.map((row, index) => (
                  <tr key={index}>
                    <td>{row.month}</td>
                    <td>{row.prescriptions}</td>
                    <td>{row.total_service_charges.toFixed(2)}</td>
                    <td>{row.total_medicine_sales.toFixed(2)}</td>
                    <td>{row.total_revenue.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
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
          <option value="medicine-usage">Medicine Usage</option>
          <option value="monthly-revenue">Monthly Revenue</option>
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