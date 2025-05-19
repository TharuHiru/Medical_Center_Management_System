const nodemailer = require('nodemailer');
const puppeteer = require('puppeteer');
const path = require('path');
const emailModel = require('../models/emailModel');

exports.getPatientEmail = async (req, res) => {
  try {
    const { patientId } = req.params;
    
    // Get email from model
    const email = await emailModel.getPatientEmailById(patientId);
    
    if (!email) {
      return res.status(404).json({ 
        success: false, 
        message: 'Patient email not found' 
      });
    }

    res.status(200).json({ 
      success: true, 
      email 
    });

  } catch (error) {
    console.error('Error in getPatientEmail:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch patient email',
      error: error.message 
    });
  }
};

const generatePdf = async (htmlContent) => {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    
    return await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '20mm', right: '20mm', bottom: '20mm', left: '20mm' }
    });
  } finally {
    if (browser) await browser.close();
  }
};

exports.sendPrescriptionEmail = async (req, res) => {
  try {
    const { htmlContent, patientEmail, patientName } = req.body;

    // Generate PDF
    const pdfBuffer = await generatePdf(htmlContent);

    // Configure email transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false // ⚠️ Only for development!
      }
    });

    // Send email
    transporter.sendMail({
      from: `"Polyclinic Medical Center" <${process.env.EMAIL_USER}>`,
      to: patientEmail,
      subject: `Your Prescription - ${new Date().toLocaleDateString()}`,
      html: `
        <p>Dear ${patientName},</p>
        <p>Please find your prescription attached.</p>
        <p>Best regards,<br/>Polyclinic Medical Center</p>
      `,
      attachments: [{
        filename: `prescription_${Date.now()}.pdf`,
        content: pdfBuffer,
        contentType: 'application/pdf'
      }]
    });

    res.status(200).json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error in sendPrescriptionEmail:', error);
    res.status(500).json({ success: false, message: 'Failed to send email' });
  }
};

// Add this to your existing emailController.js
exports.sendReceiptEmail = async (req, res) => {
  try {
    const { htmlContent, recipientEmail, prescriptionId } = req.body;

    // Generate PDF (reusing the same function)
    const pdfBuffer = await generatePdf(htmlContent);

    // Reuse the same transporter configuration
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false // ⚠️ Only for development!
      }
    });

    // Send email with customized receipt content
    transporter.sendMail({
      from: `"Polyclinic Medical Center" <${process.env.EMAIL_USER}>`,
      to: recipientEmail,
      subject: `Your Receipt - Prescription #${prescriptionId}`,
      html: `
        <p>Dear Valued Patient,</p>
        <p>Please find your receipt attached.</p>
        <p>Best regards,<br/>Polyclinic Medical Center</p>
      `,
      attachments: [{
        filename: `receipt_${prescriptionId}.pdf`,
        content: pdfBuffer,
        contentType: 'application/pdf'
      }]
    });

    res.status(200).json({ success: true, message: 'Receipt email sent successfully' });
  } catch (error) {
    console.error('Error in sendReceiptEmail:', error);
    res.status(500).json({ success: false, message: 'Failed to send receipt email' });
  }
};

exports.generatePdf = async (req, res) => {
  try {
    const { htmlContent } = req.body;
    const pdfBuffer = await generatePdf(htmlContent);
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=prescription.pdf');
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Error in generatePdf:', error);
    res.status(500).json({ success: false, message: 'Failed to generate PDF' });
  }
};