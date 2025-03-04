"use client";

import React, { useState } from 'react';
import { Button, Modal, Form, Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify'; // Import Toastify for toast notifications
import 'react-toastify/dist/ReactToastify.css';
import { FaUser } from 'react-icons/fa'; // Import icons
import '../Styles/loginForms.css';

import { registerAssistant } from "../services/authService";

const AddInventoryModal = ({ showModal, handleClose }) => {
  const [InventoryDetails, setInventoryDetails] = useState({
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
    setInventoryDetails({ ...InventoryDetails, [name]: value });
  };

  // Form validation logic
  const validateForm = () => {
    if ((!InventoryDetails.firstname.trim()) 
        || (!InventoryDetails.lastname.trim())
        || (!InventoryDetails.email.trim())
        || (!InventoryDetails.contact.trim())) 
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
      const response = await registerInventory(InventoryDetails);
      if (response.success) {
        toast.success('Inventory added successfully');
        setInventoryDetails({
          nic: '', title: '', firstname: '', lastname: '', contact: '',
          houseNo: '', addline1: '', addline2: '', email: '', password: ''
        });
        handleClose();
      } 
      else {
        toast.error(response.message || 'Error adding Inventory');
      }
    } 
    catch (error) {
      toast.error('Error adding Inventory: ' + error.message);
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
                <Form.Label>Medicine Name</Form.Label>
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
                <Form.Label>Batch Number</Form.Label>
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
                <Form.Label>Expiry Date</Form.Label>
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
                <Form.Label>Quantity</Form.Label>
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
                <Form.Label>Buying Price</Form.Label>
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
                <Form.Label>Unit Price</Form.Label>
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
          <Button 
            variant="primary" 
            type="submit" 
            disabled={loading} 
            className="btn btn-primary w-100 loginBtn"
          >
            {loading ? 'Submitting...' : 'Add Inventory'}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddInventoryModal;
