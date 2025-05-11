// components/editAllergies.js
"use client";
import { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { editPatientAllergies } from "@/services/prescriptionService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";

export default function AllergiesModel({ show, handleClose, patientId, initialAllergies, onSave }) {
  const [allergyText, setAllergyText] = useState("");

  useEffect(() => {
    if (show) {
      setAllergyText(initialAllergies || "");
    }
  }, [show, initialAllergies]);

  const handleEdit = async () => {
    try {
      const response = await editPatientAllergies(patientId, allergyText);
      if (response.success) {
        toast.success("Allergies updated successfully!");
        onSave(allergyText); // Send updated allergy back to prescription model
        handleClose();
      } else {
        toast.err("Failed to update allergies.");
      }
    } catch (error) {
      console.error("Error editing allergies:", error);
      toast.err("An error occurred while updating allergies.");
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Allergies</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group>
          <Form.Label>Allergies</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={allergyText}
            onChange={(e) => setAllergyText(e.target.value)}
          />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleEdit}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
