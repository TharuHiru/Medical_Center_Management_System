"use client";
import { useState, useEffect } from "react";
import { Modal, Button, Form, Table } from "react-bootstrap";
import { fetchMedicineCategory } from "../services/inventoryService"; // toget the medicine categories
import { addPrescription } from "../services/prescriptionService"; // imported the service file
import { useAuth } from "../context/AuthContext"; 

export default function PrescriptionModal({ show, handleClose,patientId , }) {
  // the model receives three props
  const { doctorID } = useAuth(); // Get the doctor ID from context
  const [diagnosis, setDiagnosis] = useState("");
  const [others, setOthers] = useState("");
  const [prescribedMedicines, setPrescribedMedicines] = useState([]);
  const [inventory, setMedicineCategories] = useState([]);

  //get categories
  useEffect(() => {
      const getCategories = async () => {
        try {
          const response = await fetchMedicineCategory(); // API call
          setMedicineCategories(response.data); // Store categories
        } catch (error) {
          console.error("Failed to fetch medicine categories:", error);
        }
      };
      getCategories();
    }, []);

    //Adds a blank medicine object to prescription list
  const addMedicine = () => {
    setPrescribedMedicines([...prescribedMedicines, { name: "", dosage: "" , unitCount: "" }]);
  };

  // Updates the medicine object in the prescription list
  const updateMedicine = (index, field, value) => {
    const updatedMedicines = [...prescribedMedicines];
    updatedMedicines[index][field] = value;
    setPrescribedMedicines(updatedMedicines);
  };

  //removes a medicine entry according to the index
  const removeMedicine = (index) => {
    setPrescribedMedicines(prescribedMedicines.filter((_, i) => i !== index));
  };
  
      // Collect your final payload
      const handleSubmit = async () => {
        try {
          const today = new Date().toISOString().split("T")[0];
  
          const prescriptionPayload = {
            date: today,
            diagnosis,
            otherNotes: others,
            patient_ID: patientId,
            doctor_ID: doctorID, // 👈 Use context-based doctorID
            medicines: prescribedMedicines.map((med) => ({
              medicine_Name: med.name,
              dosage: med.dosage,
              unitCount: med.unitCount,
            })),
          };

          //Call the service function to add the prescription       
          const result = await addPrescription(prescriptionPayload);
      
          if (result.success) {
            alert(result.message);
            handleClose();
          } else {
            alert(result.message);
          }
      
        } catch (error) {
          console.error("Error while preparing prescription payload:", error);
        }
      };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add Prescription</Modal.Title>
      </Modal.Header>
      
          <Modal.Body>
          <p>Patient ID: {patientId}</p>
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
                    <th>No of units</th>
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
                          {inventory.map((item) => (
                            <option key={item.medicine_ID} value={item.medicine_Name}>
                            {item.medicine_ID} - {item.medicine_Name}
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
                        <Form.Control
                          type="text"
                          value={med.unitCount}
                          onChange={(e) =>
                            updateMedicine(index, "unitCount", e.target.value)
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
};
