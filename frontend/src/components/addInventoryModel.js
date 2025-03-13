"use client";

import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaUser } from 'react-icons/fa';
import '../Styles/loginForms.css';

import { registerInventory ,fetchMedicineCategory} from "../services/inventoryService"; // API call to add inventory

const AddInventoryModal = ({ showModal, handleClose }) => {
  const [inventoryDetails, setInventoryDetails] = useState({
    medicine_id: '',
    batch_no: '',
    exp_date: '',
    stock_quantity: '',
    unit_price: '',
    buying_price: '',
  });

  const [loading, setLoading] = useState(false); //loading state of the form 
  const [medicines, setMedicines] = useState([]); // store the medicine list

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const response = await fetchMedicineCategory(); // call the function imported
        if (response.success) {
          setMedicines(response.data);
        } else {
          toast.error("Failed to load medicines");
        }
      } catch (error) {
        toast.error("Error fetching medicines: " + error.message);
      }
    };
    fetchMedicines();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInventoryDetails({ ...inventoryDetails, [name]: value });
  };

  const validateForm = () => {
    if (!inventoryDetails.medicine_id || !inventoryDetails.batch_no.trim() ||
        !inventoryDetails.exp_date.trim() || !inventoryDetails.stock_quantity.trim() ||
        !inventoryDetails.unit_price.trim() || !inventoryDetails.buying_price.trim()) {
      toast.error('Please fill all the values');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await registerInventory(inventoryDetails); // call inventory register API

      if (response.success) {
        toast.success('Inventory added successfully');

        //clear the form
        setInventoryDetails({
          medicine_id: '', batch_no: '', exp_date: '', stock_quantity: '', unit_price: '', buying_price: ''
        });

        handleClose();

      } 
        else {
        toast.error(response.message || 'Error adding inventory');
      }
    } 
      catch (error) {
      toast.error('Error adding inventory: ' + error.message);
    }
    setLoading(false);
  };

  return (
    <Modal show={showModal} onHide={handleClose} backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title className='addAssistTitle'>
          <FaUser size={30}/> &nbsp; Add New Inventory Record
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form onSubmit={handleSubmit} className='addAssistForm'>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="formMedicine" className="formGroup">
                <Form.Label>Medicine Name</Form.Label>
                <Form.Control
                  as="select"
                  name="medicine_id"
                  value={inventoryDetails.medicine_id}
                  onChange={handleInputChange}
                  className="formControl"
                >
                  <option value="">Select Medicine</option>
                  {medicines.map((medicine) => (
                    <option key={medicine.medicine_ID} value={medicine.medicine_ID}>
                      {medicine.medicine_Name}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="formBatchNo" className="formGroup">
                <Form.Label>Batch Number</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Batch Number"
                  name="batch_no"
                  value={inventoryDetails.batch_no}
                  onChange={handleInputChange}
                  className="formControl"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="formExpDate" className="formGroup">
                <Form.Label>Expiry Date</Form.Label>
                <Form.Control
                  type="date"
                  name="exp_date"
                  value={inventoryDetails.exp_date}
                  onChange={handleInputChange}
                  className="formControl"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="formStockQuantity" className="formGroup">
                <Form.Label>Quantity</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter Quantity"
                  name="stock_quantity"
                  value={inventoryDetails.stock_quantity}
                  onChange={handleInputChange}
                  className="formControl"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="formBuyingPrice" className="formGroup">
                <Form.Label>Buying Price</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter Buying Price"
                  name="buying_price"
                  value={inventoryDetails.buying_price}
                  onChange={handleInputChange}
                  className="formControl"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="formUnitPrice" className="formGroup">
                <Form.Label>Unit Price</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter Unit Price"
                  name="unit_price"
                  value={inventoryDetails.unit_price}
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
