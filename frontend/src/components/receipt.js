import React from "react";
import { Modal, Button, Table } from "react-bootstrap";
import Swal from 'sweetalert2';

export default function Receipt({ show, onHide, serviceCharge, medicines, prescriptionId, onConfirmClose}) {
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
      const response = await fetch('/api/send-receipt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prescriptionId })
      });

      const result = await response.json();
      if (result.success) {
        alert("Receipt sent successfully!");
      } else {
        alert("Failed to send receipt.");
      }
    } catch (error) {
      console.error(error);
      alert("Error sending email.");
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header>
        <Modal.Title>Billing Receipt</Modal.Title>
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
