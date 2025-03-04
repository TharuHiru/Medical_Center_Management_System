"use client";

import React, { useState } from 'react';
import { Button, Modal, Form, Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify'; // Import Toastify for toast notifications
import 'react-toastify/dist/ReactToastify.css';
import { FaUser } from 'react-icons/fa'; // Import icons
import '../Styles/loginForms.css';

//import { registerPatient } from "../services/authService";


const AddPatientModal = ({ showModal, handleClose }) => {
  const [patientDetails, setPatientDetails] = useState({
    nic: '',
    title: '',
    firstname: '',
    lastname: '',
    contact: '',
    houseNo: '',
    addline1: '',
    addline2: '',
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPatientDetails({ ...patientDetails, [name]: value });
  };

  // Form validation logic
  const validateForm = () => {
    if ((!patientDetails.firstname.trim()) 
        || (!patientDetails.lastname.trim())
        || (!patientDetails.email.trim())
        || (!patientDetails.contact.trim())) 
    {    
      toast.error('Please Fill all the values');
      return false;
    }
    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await registerPatient(patientDetails);
      if (response.success) {
        toast.success('Assistant added successfully');
        //clear the form
        setPatientDetails({
          nic: '', title: '', firstname: '', lastname: '', contact: '',
          houseNo: '', addline1: '', addline2: '', email: '', password: ''
        });
        handleClose(); // Close modal after successful submission
      } 
      else {
        toast.error(response.message || 'Error adding patient');
      }
    } 
    catch (error) {
      toast.error('Error adding patient: ' + error.message);
    }
    setLoading(false);
  };

  return (
    <Modal show={showModal} onHide={handleClose} backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title className="addAssistTitle">
          <FaUser size={30} /> &nbsp; Add New Patient
        </Modal.Title>
      </Modal.Header>
  
      <Modal.Body>
        <Form onSubmit={handleSubmit} className="addAssistForm">
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
              <Form.Group controlId="formContact" className="formGroup">
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
  
          <Row className="mb-3">
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
          </Row>
  
          <Row className="mb-3">
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
            <Col md={6}>
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
  );
}  

export default AddPatientModal;
