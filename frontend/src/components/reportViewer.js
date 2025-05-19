import React, { useState, useRef } from 'react';
import { fetchReport } from '@/services/reportService';
import "@/Styles/reportViewer.css";
import { Image } from 'react-bootstrap';
import { useReactToPrint } from 'react-to-print';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const ReportViewer = () => {
  const [reportType, setReportType] = useState('revenue-profit-analysis');
  const [dateRange, setDateRange] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [reportData, setReportData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const reportRef = useRef();

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

  // Print handler
  const handlePrint = useReactToPrint({
    content: () => reportRef.current,
    pageStyle: `
      @page { size: auto; margin: 10mm; }
      @media print {
        body { margin: 0; padding: 0; }
        .report-container { box-shadow: none; margin: 0; }
        .print-btn, .report-controls { display: none !important; }
      }
    `,
  });

  // PDF download handler
  const handleDownloadPDF = async () => {
    if (!reportRef.current) return;

    setIsLoading(true);
    try {
      const element = reportRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        scrollX: 0,
        scrollY: -window.scrollY,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 190; // Slightly less than A4 width
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
      pdf.save('medical-center-report.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF');
    } finally {
      setIsLoading(false);
    }
  };

  // Report content component
  const ReportContent = React.forwardRef(
    ({ reportData, dateRange, handlePrint, handleDownloadPDF, isLoading }, ref) => (
      <div className="report-container printable" ref={ref}>
      <div className="report-header">
        <div className="header-content">
          <Image src="/Logo.png" alt="Poly Clinic" width={100} height={100} className="header-logo"/>
          <h2>Medical Center - Revenue & Profit Analysis</h2>
        </div>
        <p className="report-period">
          Period: {new Date(dateRange.startDate).toLocaleDateString()} to {new Date(dateRange.endDate).toLocaleDateString()}
        </p>
        <p className="report-generated">
          Generated on: {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
        </p>
      </div>
        {/* 1. Consultation Summary */}
        <div className="section-container">
          <h4 className="section-title">Consultation Summary</h4>
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
          <h4 className="section-title">Medicine Sales Summary</h4>
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
          <h4 className="section-title">Detailed Medicine Sales</h4>
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
          <button className="btn btn-secondary print-btn me-2" onClick={handlePrint}>
            Print Report
          </button>
          <button
            className="btn btn-primary print-btn"
            onClick={handleDownloadPDF}
            disabled={isLoading}
          >
            {isLoading ? 'Generating PDF...' : 'Download as PDF'}
          </button>
        </div>
      </div>
    )
  );
  ReportContent.displayName = "ReportContent";

  const renderReport = () => {
    if (!reportData) return <p>No report generated yet</p>;
    return (
      <ReportContent
        reportData={reportData}
        dateRange={dateRange}
        handlePrint={handlePrint}
        handleDownloadPDF={handleDownloadPDF}
        isLoading={isLoading}
        ref={reportRef}
      />
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
              onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
            />
          </div>
          <div className="col">
            <label className="form-label">End Date:</label>
            <input
              type="date"
              className="form-control"
              value={dateRange.endDate}
              onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
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

      {/* Only the report content is passed to the ref for printing/PDF */}
      <div>
        {renderReport()}
      </div>
    </div>
  );
};

export default ReportViewer;