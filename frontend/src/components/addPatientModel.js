"use client";

import React, { useState } from "react";
import { Button, Modal, Form, Row, Col } from "react-bootstrap";
import { toast } from "react-toastify";
import { FaUser } from "react-icons/fa";
import ViewAndPrintQr from "./viewAndPrintQr"; 
import { useEffect } from "react";
import { registerPatient , getMasterAccounts} from "@/services/authService";
import '@/Styles/loginForms.css';

const AddPatientModal = ({ showModal, handleClose }) => {
  const [patientDetails, setPatientDetails] = useState({
    title: "",
    firstname: "",
    lastname: "",
    contact: "",
    gender: "",
    dob: "",
    houseNo: "",
    addline1: "",
    addline2: "",
    email: "",
    masterAccountID : ""// Add masterAccountID 
  });

  const [loading, setLoading] = useState(false); // state variable for form submission in progress
  const [showQrModal, setShowQrModal] = useState(false); //control the visibility of QR model
  const [newPatient, setNewPatient] = useState(null); // store the new patient data
  const [masterAccounts, setMasterAccounts] = useState([]); // State to hold master account IDs

  //GET THE MASTER ACCOUNTS
  useEffect(() => {
    const fetchMasterAccounts = async () => {
      try {
        const response = await getMasterAccounts(); // API call to fetch master accounts
        setMasterAccounts(response|| []); // Set the master accounts in state
      } 
      catch (error) {
        toast.error("Error fetching master accounts"); // Full error object
        if (error.response) {
          console.error("Response Data:", error.response.data);
          console.error("Status:", error.response.status);
        }
        toast.error("Error fetching master accounts.");
      }
    };

    if (showModal) {
      fetchMasterAccounts();
    }
  }, [showModal]);

  //handle form input data
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPatientDetails({ ...patientDetails, [name]: value });
  };

  //validation of the form fields
  const validateForm = () => {
    if (!patientDetails.firstname.trim() || !patientDetails.lastname.trim() || !patientDetails.email.trim() || !patientDetails.contact.trim()) {
      toast.error("Please fill in all required fields.");
      return false;
    }
    return true;
  };

  // handle form submit method
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return; // validate the form
    setLoading(true); // set loading state to true

    //Run API call to register the patient
    try {
      const response = await registerPatient(patientDetails);
      console.log("patient details:", patientDetails); // Debugging log
  
      if (response.success) {
        toast.success("Patient registered successfully!");
  
        //Save the new patient data
        const newPatientData = {
          patientID: response.patientID,
          name: response.name,
          qrCode: response.qrCode,
          qrPage: response.qrPage,
        };
  
        console.log("New Patient Data:", newPatientData || "no data received"); // Debugging log
  
        setNewPatient(newPatientData);
  
        // Show the QR modal before closing AddPatientModal
        setShowQrModal(true);
  
        // Close AddPatientModal with a slight delay
        setTimeout(() => {
          handleClose();
        }, 300);
  
        // Reset form
        setPatientDetails({
          title: "",
          firstname: "",
          lastname: "",
          contact: "",
          gender: "",
          dob: "",
          houseNo: "",
          addline1: "",
          addline2: "",
          email: "",
        });
      } else {
        toast.error(response.message || "Error adding patient");
      }
    } catch (error) {
      toast.error("Error adding patient: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <Modal show={showModal} onHide={handleClose} backdrop="static" keyboard={false}>
      <Modal.Header closeButton className="model-head">
        <Modal.Title className="addAssistTitle">
          <FaUser size={30} /> &nbsp; Add New Patient
        </Modal.Title>
      </Modal.Header>
  
      <Modal.Body>
        <Form onSubmit={handleSubmit} className="addAssistForm">

        {/*Select box to link with an existing master Account*/}
        <Row className="mb-3">
              <Col md={12}>
                <Form.Group controlId="formMasterAccount" className="formGroup">
                  <Form.Label>Select Master Account</Form.Label>
                  <Form.Control
                    as="select"
                    name="masterAccountID"
                    value={patientDetails.masterAccountID}
                    onChange={handleInputChange}
                    className="formControl"
                  >
                    <option value="">Select a Master Account</option>
                    {masterAccounts.length > 0 &&
                      masterAccounts.map((account) => (
                        <option key={account.patient_id} value={account.patient_id}>
                          {account.patient_id} - {account.firstName} {account.lastName}
                        </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>
          
          {/*Other Details to register a patient*/}
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="formTitle" className="formGroup">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Title"
                  name="title"
                  value={patientDetails.title}
                  onChange={handleInputChange}
                  className="formControl"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="formFirstName" className="formGroup">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter First Name"
                  name="firstname"
                  value={patientDetails.firstname}
                  onChange={handleInputChange}
                  className="formControl"
                />
              </Form.Group>
            </Col>
          </Row>
  
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="formLastName" className="formGroup">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Last Name"
                  name="lastname"
                  value={patientDetails.lastname}
                  onChange={handleInputChange}
                  className="formControl"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="formContact" className="formGroup ">
                <Form.Label>Contact</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Contact"
                  name="contact"
                  value={patientDetails.contact}
                  onChange={handleInputChange}
                  className="formControl"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={12}>
              <Form.Group controlId="formGender" className="formGroup genderBoxBorder">
                <Form.Label className="genderLabel">Gender</Form.Label>
                <Row>
                  <Col md={6}>
                    <Form.Check
                      type="radio"
                      label="Male"
                      name="gender"
                      value="male"
                      checked={patientDetails.gender === "male"}
                      onChange={handleInputChange}
                    />
                  </Col>
                  <Col md={6}>
                    <Form.Check
                      type="radio"
                      label="Female"
                      name="gender"
                      value="female"
                      checked={patientDetails.gender === "female"}
                      onChange={handleInputChange}
                    />
                  </Col>
                </Row>
              </Form.Group>
            </Col>
          </Row>
          <Row className="mb-3">
          <Col md={6}>
          <Form.Label>Date of Birth</Form.Label>
          <Form.Control
            type="date"
            name="dob"
            value={patientDetails.dob}
            onChange={handleInputChange}
          />
        </Col>
            <Col md={6}>
              <Form.Group controlId="formHouseNo" className="formGroup">
                <Form.Label>House No</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter House No"
                  name="houseNo"
                  value={patientDetails.houseNo}
                  onChange={handleInputChange}
                  className="formControl"
                />
              </Form.Group>
            </Col>
          </Row>
  
          <Row className="mb-3">
          <Col md={6}>
              <Form.Group controlId="formAddLine1" className="formGroup">
                <Form.Label>Address Line 1</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Address Line 1"
                  name="addline1"
                  value={patientDetails.addline1}
                  onChange={handleInputChange}
                  className="formControl"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="formAddLine2" className="formGroup">
                <Form.Label>Address Line 2</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Address Line 2"
                  name="addline2"
                  value={patientDetails.addline2}
                  onChange={handleInputChange}
                  className="formControl"
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
          <Col md={12}>
              <Form.Group controlId="formEmail" className="formGroup">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter Email"
                  name="email"
                  value={patientDetails.email}
                  onChange={handleInputChange}
                  className="formControl"
                />
              </Form.Group>
            </Col>
          </Row>

  
          <Button
            variant="primary"
            type="submit"
            disabled={loading}
            className="btn btn-primary w-100 loginBtn"
          >
            {loading ? 'Submitting...' : 'Add Patient'}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  
    {/* Conditionally render the ViewAndPrintQr modal */}
    {showQrModal && newPatient && (
      <ViewAndPrintQr 
        showModal={showQrModal}
        handleClose={() => setShowQrModal(false)}
        patient={newPatient} // Pass the patient data to the modal
      />
    )}
    </>
  );
};

export default AddPatientModal;
