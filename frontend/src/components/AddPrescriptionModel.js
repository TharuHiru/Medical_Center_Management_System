"use client";
import { useState } from "react";
import { Modal, Button, Form, Table } from "react-bootstrap";

export default function PrescriptionModal({ show, handleClose, medicines }) {
  const [diagnosis, setDiagnosis] = useState("");
  const [others, setOthers] = useState("");
  const [prescribedMedicines, setPrescribedMedicines] = useState([]);

  const addMedicine = () => {
    setPrescribedMedicines([...prescribedMedicines, { name: "", dosage: "" }]);
  };

  const updateMedicine = (index, field, value) => {
    const updatedMedicines = [...prescribedMedicines];
    updatedMedicines[index][field] = value;
    setPrescribedMedicines(updatedMedicines);
  };

  const removeMedicine = (index) => {
    setPrescribedMedicines(prescribedMedicines.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    console.log({ diagnosis, others, prescribedMedicines });
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add Prescription</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Diagnosis</Form.Label>
            <Form.Control
              type="text"
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Other Notes</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              value={others}
              onChange={(e) => setOthers(e.target.value)}
            />
          </Form.Group>

          <h5>Medicines</h5>
          <Table striped bordered hover size="sm">
            <thead>
              <tr>
                <th>Medicine</th>
                <th>Dosage</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {prescribedMedicines.map((med, index) => (
                <tr key={index}>
                  <td>
                    <Form.Select
                      value={med.name}
                      onChange={(e) =>
                        updateMedicine(index, "name", e.target.value)
                      }
                    >
                      <option value="">Select Medicine</option>
                      {medicines.map((med, idx) => (
                        <option key={idx} value={med}>
                          {med}
                        </option>
                      ))}
                    </Form.Select>
                  </td>
                  <td>
                    <Form.Control
                      type="text"
                      value={med.dosage}
                      onChange={(e) =>
                        updateMedicine(index, "dosage", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => removeMedicine(index)}
                    >
                      ❌
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Button variant="success" onClick={addMedicine}>
            ➕ Add Medicine
          </Button>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Save Prescription
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
