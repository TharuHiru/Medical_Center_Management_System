"use client";
import { useState, useEffect } from "react";
import { Modal, Button, Form, Table } from "react-bootstrap";
import { fetchMedicineCategory } from "../services/inventoryService"; // toget the medicine categories
import { addPrescription , fetchPatientAllergies } from "../services/prescriptionService"; // imported the service file
import AllergiesModel from '../components/editAllergies.js'; 
import { useAuth } from "../context/AuthContext"; 
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaTimes , FaPlus ,FaPrescriptionBottleAlt } from 'react-icons/fa';
import '../Styles/loginForms.css';

export default function PrescriptionModal({ show, handleClose,patientId,appointmentID}) {
  // the model receives three props
  const { doctorID } = useAuth(); // Get the doctor ID from context
  const [diagnosis, setDiagnosis] = useState("");
  const [others, setOthers] = useState("");
  const [prescribedMedicines, setPrescribedMedicines] = useState([]);
  const [inventory, setMedicineCategories] = useState([]);
  const [allergies, setAllergies] = useState("");
  const [showAllergiesModal, setShowAllergiesModal] = useState(false); 

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
  
  //Fetch allergies when patient ID changes and model opens
  useEffect(() => {
    if (show && patientId) {
      const fetchAllergies = async () => {
        try {
          const response = await fetchPatientAllergies(patientId);
          if (response.success) {
            setAllergies(response.allergies);
          } else {
            setAllergies("No allergies found");
            console.error("Error fetching allergies:", response.message);
          }
        } catch (error) {
          setAllergies("Error fetching");
          console.error("Error fetching allergies:", error);
        }
      };
      fetchAllergies();
    }
  }, [show, patientId]);

  const handleSaveAllergies = (newAllergies) => {
    setAllergies(newAllergies); // update allergies shown in parent
  };
  
      // Collect your final payload
      const handleSubmit = async () => {
        try {
          const today = new Date().toISOString().split("T")[0];
  
          const prescriptionPayload = {
            status: "pending",
            date: today,
            diagnosis,
            otherNotes: others,
            patient_ID: patientId,
            appointment_ID : appointmentID ,
            doctor_ID: doctorID, // 👈 Use context-based doctorID
            medicines: prescribedMedicines.map((med) => ({
              medicine_Name: med.name,
              dosage: med.dosage,
            })),
          };

          //Call the service function to add the prescription       
          const result = await addPrescription(prescriptionPayload);
      
          if (result.success) {
            toast.success(result.message);
            handleClose();
          } else {
            toast.err(result.message);
          }
      
        } catch (error) {
          toast.err("Error while preparing prescription payload:", error);
        }
      };

      // reset the model data when closes
      useEffect(() => {
        if (show) {
          setDiagnosis("");
          setOthers("");
          setPrescribedMedicines([]);
          setAllergies("");
        }
      }, [show]);

  return (
    <>
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton className="model-head">
        <Modal.Title className="addAssistTitle">
          <FaPrescriptionBottleAlt style={{ marginRight: "10px" }} />
            Add Prescription</Modal.Title>
      </Modal.Header>     
          <Modal.Body>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <tbody>
            <tr>
              <td><strong>Patient ID: </strong> {patientId}</td>
              <td><strong>Appointment ID: </strong> {appointmentID}</td>
            </tr>
            </tbody>
          </table>
          <br></br>
          
          {/*Allergies section*/}
          <div className="genderBoxBorder">
          <table>
          <tbody>
          <tr>
          <td style={{ width: "80%" }}>
            <strong className = "genderLabel" >Allergies:</strong>
              <textarea
              readOnly
              value={allergies || 'No allergies found'}
              className="form-control allergy-box"
              rows={3} 
              style={{ width: "100%" }}
            />
          </td>
          <td style={{ verticalAlign: "bottom", paddingLeft: "10px" }}>
            <button
              className="btn btn-primary allergy-btn mt-2 mb-3"
              onClick={() => setShowAllergiesModal(true)}>
              Edit Allergies
            </button>
          </td>
          </tr>
          </tbody>
          </table>
          </div>

          {/*Rest of the form*/}
            <Form>
              <Form.Group className="mb-3">
                <strong>Diagnosis</strong>
                <Form.Control
                  type="text"
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <strong>Other Notes</strong>
                <Form.Control
                  as="textarea"
                  rows={2}
                  value={others}
                  onChange={(e) => setOthers(e.target.value)}
                />
              </Form.Group>
              {/* Medicine Adding section*/}
              <strong >Medicines</strong>
              <Table striped bordered hover >
                <thead>
                  <tr>
                    <td>Medicine</td>
                    <td>Dosage</td>
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
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => removeMedicine(index)}
                        >
                          <FaTimes /> 
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <Button className="allergy-btn" onClick={addMedicine}>
                <FaPlus></FaPlus> Add Medicine
              </Button>
            </Form>
          </Modal.Body>
          <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button className = " submit-btn" variant="primary" onClick={handleSubmit}>
            Save Prescription
          </Button>
      </Modal.Footer>
    </Modal>
  
   {/* Allergies Edit Modal */}
   {showAllergiesModal && (
  <AllergiesModel
    show={true}
    handleClose={() => setShowAllergiesModal(false)}
    patientId={patientId}
    initialAllergies={allergies}
    onSave={handleSaveAllergies}
  />
)}
</>
);
};
