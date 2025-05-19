import React from "react";
import { Modal, Button, Table, Image } from "react-bootstrap";
import Swal from 'sweetalert2';
import { sendReceiptEmail } from '@/services/prescriptionPdfService';


export default function Receipt({ show, onHide, serviceCharge, medicines, prescriptionId, onConfirmClose ,patientEmail}) {
  const total = medicines.reduce((sum, med) => {
    const price = parseFloat(med.unit_price) || 0;
    const units = parseFloat(med.units) || 0;
    return sum + price * units;
  }, parseFloat(serviceCharge) || 0);

  const handlePrint = () => {
    window.print();
  };

  const handleConfirmClose = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "This will close the receipt and all billing data.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, close all",
    }).then((result) => {
      if (result.isConfirmed) {
        onConfirmClose(); // Call parent's reset logic
      }
    });
  };

  const handleSendToEmail = async () => {
  try {
    // Get the modal content HTML
    const modalContent = document.querySelector('.modal-content').outerHTML;

    // Convert local images to base64
    const images = document.querySelectorAll('.modal-content img');
    for (const img of images) {
      if (img.src.startsWith('http')) continue;
      
      const response = await fetch(img.src);
      const blob = await response.blob();
      const base64 = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => resolve(reader.result);
      });
      // Create a temporary div to hold modified HTML
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = modalContent;
      tempDiv.querySelector(`img[src="${img.src}"]`).src = base64;
      modalContent = tempDiv.outerHTML;
    }

    // Send via service
    await sendReceiptEmail({
      htmlContent: modalContent,
      recipientEmail: patientEmail,
      prescriptionId
    });
    console.log("patient email :  " , patientEmail);

    Swal.fire({
      title: "Success!",
      text: "Receipt sent to email successfully!",
      icon: "success"
    });
  } catch (error) {
    Swal.fire({
      title: "Error!",
      text: error.message || "Failed to send receipt",
      icon: "error"
    });
    console.error(error);
  }
};
  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header>
      {/* Header with logo and description */}
      <div className="d-flex align-items-center mb-4">
        <Image src="/Logo.png" alt="Poly Clinic" width={100} height={100} className="me-5" />
        <div>
        <h3 className="mb-1">Polyclinic Medical Center</h3>
        <p className="mb-0 text-muted" style={{ fontSize: "1rem" }}>
          Temple Road, Thalawathugoda, Sri Lanka | Phone: 071-7517940 <br />
          Providing quality healthcare with compassion and care.
        </p>
        </div>
      </div> 
      </Modal.Header>
      <Modal.Body>
        <h5>Prescription ID: {prescriptionId}</h5>
        <Table bordered>
          <thead>
            <tr>
              <th>Brand Name</th>
              <th>Units</th>
              <th>Unit Price</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {medicines.map((med, index) => (
              <tr key={index}>
                <td>{med.brandName || "N/A"}</td>
                <td>{med.units}</td>
                <td>{med.unit_price}</td>
                <td>{(parseFloat(med.unit_price) * parseFloat(med.units)).toFixed(2)}</td>
              </tr>
            ))}
            <tr>
              <td colSpan="3" className="text-end fw-bold">Service Charge</td>
              <td>{serviceCharge}</td>
            </tr>
            <tr>
              <td colSpan="3" className="text-end fw-bold">Total</td>
              <td className="fw-bold">{total.toFixed(2)}</td>
            </tr>
          </tbody>
        </Table>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleSendToEmail}>
          Send to Me
        </Button>
        <Button variant="primary" onClick={handlePrint}>
          Print
        </Button>
        <Button variant="outline-danger" onClick={handleConfirmClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
