"use client";

import React, { useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';;
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
    <Modal show={showModal} onHide={handleClose} backdrop="static" keyboard={false} >
      <Modal.Header closeButton>
      <Modal.Title className='addAssistTitle'>
          <FaUser size={30}/> &nbsp;
          Add New Patient
      </Modal.Title>
      </Modal.Header>
      <Modal.Body  >
      <Form onSubmit={handleSubmit} className='addAssistForm' >
        <Form.Group controlId="formNIC" className='addAssisttextbox'>
          <Form.Label>Title</Form.Label>          
            <Form.Control 
                type="text"
                placeholder="Enter Title"
                name="title"
                value={patientDetails.nic}
                onChange={handleInputChange}
        />
        </Form.Group>

        <Form.Group controlId="formTitle" className='addAssisttextbox'>
          <Form.Label>Title</Form.Label>          
            <Form.Control
                type="text"
                placeholder="Enter Title"
                name="title"
                value={patientDetails.title}
                onChange={handleInputChange}
        />
        </Form.Group>

        <Form.Group controlId="formFirstName" className='addAssisttextbox'>
          <Form.Label>First Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter first name"
            name="firstname"
            value={patientDetails.firstname}
            onChange={handleInputChange}
          />
        </Form.Group>

        <Form.Group controlId="formLastName" className='addAssisttextbox'>
          <Form.Label>Last Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter last name"
            name="lastname"
            value={patientDetails.lastname}
            onChange={handleInputChange}
          />
        </Form.Group>

        <Form.Group controlId="formContact" className='addAssisttextbox'>
            <Form.Label>Contact</Form.Label>
            <Form.Control
                type="text"
                placeholder="Enter Contact"
                name="contact"
                value={patientDetails.contact}
                onChange={handleInputChange}
            />
        </Form.Group>

        <Form.Group controlId="formHouseNo" className='addAssisttextbox'>
            <Form.Label>House No</Form.Label>
            <Form.Control
                type="text"
                placeholder="Enter House No"
                name="houseNo"
                value={patientDetails.houseNo}
                onChange={handleInputChange}
            />
        </Form.Group>

        <Form.Group controlId="formAddLine1" className='addAssisttextbox'>
            <Form.Label>Address Line 1</Form.Label>
            <Form.Control
                type="text"
                placeholder="Enter Address Line 1"
                name="addline1"
                value={patientDetails.addline1}
                onChange={handleInputChange}
            />
        </Form.Group>

        <Form.Group controlId="formAddLine2" className='addAssisttextbox'>
            <Form.Label>Address Line 2</Form.Label>
            <Form.Control
                type="text"
                placeholder="Enter Address Line 2"
                name="addline2"
                value={patientDetails.addline2}
                onChange={handleInputChange}
            />      
        </Form.Group>

        <Form.Group controlId="formEmail" className='addAssisttextbox'>
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            name="email"
            value={patientDetails.email}
            onChange={handleInputChange}
          />
        </Form.Group>

            <Button variant="primary" type="submit" disabled={loading} className="btn btn-primary w-100 loginBtn">
              Add Patient
              {loading ? 'Submitting...' : ''}
            </Button>
          </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddPatientModal;
