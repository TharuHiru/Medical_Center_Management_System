"use client";

import React, { useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';;
import { toast } from 'react-toastify'; // Import Toastify for toast notifications
import 'react-toastify/dist/ReactToastify.css';
import { FaUser } from 'react-icons/fa'; // Import icons
import '../Styles/loginForms.css';

import { registerAssistant } from "../services/authService";


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
    if ((!assistantDetails.firstname.trim()) 
        || (!assistantDetails.lastname.trim())
        || (!assistantDetails.email.trim())
        || (!assistantDetails.contact.trim())) 
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
      const response = await registerAssistant(assistantDetails);
      if (response.success) {
        toast.success('Assistant added successfully');
        //clear the form
        setAssistantDetails({
          nic: '', title: '', firstname: '', lastname: '', contact: '',
          houseNo: '', addline1: '', addline2: '', email: '', password: ''
        });
        handleClose(); // Close modal after successful submission
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
          <FaUser size={30}/> &nbsp;
          Add New Assistant
      </Modal.Title>
      </Modal.Header>
      <Modal.Body  >
      <Form onSubmit={handleSubmit} className='addAssistForm' >
        <Form.Group controlId="formNIC" className='addAssisttextbox'>
          <Form.Label>NIC</Form.Label>          
            <Form.Control 
                type="text"
                placeholder="Enter NIC"
                name="nic"
                value={assistantDetails.nic}
                onChange={handleInputChange}
        />
        </Form.Group>

        <Form.Group controlId="formTitle" className='addAssisttextbox'>
          <Form.Label>Title</Form.Label>          
            <Form.Control
                type="text"
                placeholder="Enter Title"
                name="title"
                value={assistantDetails.title}
                onChange={handleInputChange}
        />
        </Form.Group>

        <Form.Group controlId="formFirstName" className='addAssisttextbox'>
          <Form.Label>First Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter first name"
            name="firstname"
            value={assistantDetails.firstname}
            onChange={handleInputChange}
          />
        </Form.Group>

        <Form.Group controlId="formLastName" className='addAssisttextbox'>
          <Form.Label>Last Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter last name"
            name="lastname"
            value={assistantDetails.lastname}
            onChange={handleInputChange}
          />
        </Form.Group>

        <Form.Group controlId="formContact" className='addAssisttextbox'>
            <Form.Label>Contact</Form.Label>
            <Form.Control
                type="text"
                placeholder="Enter Contact"
                name="contact"
                value={assistantDetails.contact}
                onChange={handleInputChange}
            />
        </Form.Group>

        <Form.Group controlId="formHouseNo" className='addAssisttextbox'>
            <Form.Label>House No</Form.Label>
            <Form.Control
                type="text"
                placeholder="Enter House No"
                name="houseNo"
                value={assistantDetails.houseNo}
                onChange={handleInputChange}
            />
        </Form.Group>

        <Form.Group controlId="formAddLine1" className='addAssisttextbox'>
            <Form.Label>Address Line 1</Form.Label>
            <Form.Control
                type="text"
                placeholder="Enter Address Line 1"
                name="addline1"
                value={assistantDetails.addline1}
                onChange={handleInputChange}
            />
        </Form.Group>

        <Form.Group controlId="formAddLine2" className='addAssisttextbox'>
            <Form.Label>Address Line 2</Form.Label>
            <Form.Control
                type="text"
                placeholder="Enter Address Line 2"
                name="addline2"
                value={assistantDetails.addline2}
                onChange={handleInputChange}
            />      
        </Form.Group>

        <Form.Group controlId="formEmail" className='addAssisttextbox'>
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            name="email"
            value={assistantDetails.email}
            onChange={handleInputChange}
          />
        </Form.Group>

            <Button variant="primary" type="submit" disabled={loading} className="btn btn-primary w-100 loginBtn">
              Add Assistant
              {loading ? 'Submitting...' : ''}
            </Button>
          </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddAssistantModal;
