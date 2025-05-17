"use client";

import React, { useState } from 'react';
import { Button, Modal, Form, Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify'; // Import Toastify for toast notifications
import 'react-toastify/dist/ReactToastify.css';
import { FaUser } from 'react-icons/fa'; // Import icons
import '@/Styles/loginForms.css';

import { registerAssistant } from "@/services/authService";

const AddAssistantModal = ({ showModal, handleClose }) => {
  const [assistantDetails, setAssistantDetails] = useState({
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
    setAssistantDetails({ ...assistantDetails, [name]: value });
  };

  const validateForm = () => {
  const { firstname, lastname, email, contact, nic } = assistantDetails;

  // Basic empty checks
  if (!firstname.trim() || !lastname.trim() || !email.trim() || !contact.trim()) {
    toast.error('Please fill all required fields');
    return false;
  }

  // Name validation
  const nameRegex = /^[A-Za-z]+$/;
  if (!nameRegex.test(firstname) || !nameRegex.test(lastname)) {
    toast.error('Names should contain only letters');
    return false;
  }

  // NIC validation (supports old 9-digit + 'V' and new 12-digit NICs)
  const nicRegex = /^(\d{9}[vV]|\d{12})$/;
  if (nic && !nicRegex.test(nic)) {
    toast.error('Invalid NIC format');
    return false;
  }

  // Contact validation (10 digits, starting with 0)
  const contactRegex = /^0\d{9}$/;
  if (!contactRegex.test(contact)) {
    toast.error('Invalid contact number');
    return false;
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    toast.error('Invalid email format');
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
      const response = await registerAssistant(assistantDetails);
      if (response.success) {
        toast.success('Assistant added successfully');
        setAssistantDetails({
          nic: '', title: '', firstname: '', lastname: '', contact: '',
          houseNo: '', addline1: '', addline2: '', email: '', password: ''
        });
        handleClose();
      } 
      else {
        toast.error(response.message || 'Error adding assistant');
      }
    } 
    catch (error) {
      toast.error('Error adding assistant: ' + error.message);
    }
    setLoading(false);
  };

  return (
    <Modal show={showModal} onHide={handleClose} backdrop="static" keyboard={false} >
      <Modal.Header closeButton>
        <Modal.Title className='addAssistTitle'>
          <FaUser size={30}/> &nbsp; Add New Assistant
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form onSubmit={handleSubmit} className='addAssistForm'>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="formNIC" className="formGroup">
                <Form.Label>NIC</Form.Label>
                <Form.Control 
                  type="text"
                  placeholder="Enter NIC"
                  name="nic"
                  value={assistantDetails.nic}
                  onChange={handleInputChange}
                  className="formControl"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="formTitle" className="formGroup">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Title"
                  name="title"
                  value={assistantDetails.title}
                  onChange={handleInputChange}
                  className="formControl"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="formFirstName" className="formGroup">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter First Name"
                  name="firstname"
                  value={assistantDetails.firstname}
                  onChange={handleInputChange}
                  className="formControl"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="formLastName" className="formGroup">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Last Name"
                  name="lastname"
                  value={assistantDetails.lastname}
                  onChange={handleInputChange}
                  className="formControl"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="formContact" className="formGroup">
                <Form.Label>Contact</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Contact"
                  name="contact"
                  value={assistantDetails.contact}
                  onChange={handleInputChange}
                  className="formControl"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="formHouseNo" className="formGroup">
                <Form.Label>House No</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter House No"
                  name="houseNo"
                  value={assistantDetails.houseNo}
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
                  value={assistantDetails.addline1}
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
                  value={assistantDetails.addline2}
                  onChange={handleInputChange}
                  className="formControl"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={12}>
              <Form.Group controlId="formEmail" className="formGroup">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter Email"
                  name="email"
                  value={assistantDetails.email}
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
            {loading ? 'Submitting...' : 'Add Assistant'}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddAssistantModal;
