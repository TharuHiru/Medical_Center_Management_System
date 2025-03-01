"use client";

import React, { useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify'; // Import Toastify for toast notifications
import 'react-toastify/dist/ReactToastify.css';

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

  // Form validation logic
  const validateForm = () => {
    if (!assistantDetails.firstname.trim())  {
      toast.error('First Name is required');
      return false;
    }
    if (!assistantDetails.lastname.trim()) {
      toast.error('Last Name is required');
      return false;
    }
    if (!assistantDetails.email.trim()) {
      toast.error('Email is required');
      return false;
    }
    if (!assistantDetails.contact.trim()) {
      toast.error('Contact number is required');
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
      const response = await axios.post('/api/add-assistant', assistantDetails);
      if (response.data.success) {
        toast.success('Assistant added successfully');
        setAssistantDetails({
          nic: '', title: '', firstname: '', lastname: '', contact: '',
          houseNo: '', addline1: '', addline2: '', email: '', password: ''
        });
        handleClose(); // Close modal after successful submission
      } else {
        toast.error(response.data.message || 'Error adding assistant');
      }
    } catch (error) {
      toast.error('Error adding assistant: ' + error.message);
    }
    setLoading(false);
  };

  return (
    <Modal show={showModal} onHide={handleClose} backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>Add New Assistant</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          {Object.entries(assistantDetails).map(([key, value]) => (
            <Form.Group key={key} controlId={`form${key}`} className="mb-3">
              <Form.Label>{key.charAt(0).toUpperCase() + key.slice(1)}</Form.Label>
              <Form.Control
                type={key === "password" ? "password" : "text"}
                placeholder={`Enter ${key}`}
                name={key}
                value={value}
                onChange={handleInputChange}
              />
            </Form.Group>
          ))}
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit'}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddAssistantModal;
