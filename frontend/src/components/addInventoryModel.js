"use client";

import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaUser } from 'react-icons/fa';
import '@/Styles/loginForms.css';

import { registerInventory, fetchMedicineCategory, fetchBrandsByMedicineID } from "@/services/inventoryService";

const AddInventoryModal = ({ showModal, handleClose }) => {
  const [inventoryDetails, setInventoryDetails] = useState({
    medicine_id: '',
    brand_ID: '',
    exp_date: '',
    stock_quantity: '',
    unit_price: '',
    buying_price: '',
  });

  const [loading, setLoading] = useState(false);
  const [medicines, setMedicines] = useState([]);
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const response = await fetchMedicineCategory();
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
    if (
      !inventoryDetails.medicine_id ||
      !inventoryDetails.brand_ID ||
      !inventoryDetails.exp_date.trim() ||
      !inventoryDetails.stock_quantity.trim() ||
      !inventoryDetails.unit_price.trim() ||
      !inventoryDetails.buying_price.trim()
    ) {
      toast.error('Please fill all the values');
      return false;
    }
    return true;
  };

  const handleMedicineSelect = async (event) => {
    const selectedID = event.target.value;

    // Set medicine_id and reset brand_ID
    setInventoryDetails(prev => ({
      ...prev,
      medicine_id: selectedID,
      brand_ID: ''
    }));

    if (selectedID) {
      try {
        const response = await fetchBrandsByMedicineID(selectedID);
        if (response.success) {
          setBrands(response.data);
        } else {
          setBrands([]);
          toast.error("Failed to fetch brand names.");
        }
      } catch (error) {
        setBrands([]);
        toast.error("Error fetching brand names.");
      }
    } else {
      setBrands([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await registerInventory(inventoryDetails);

      if (response.success) {
        toast.success('Inventory added successfully');

        setInventoryDetails({
          medicine_id: '',
          brand_ID: '',
          exp_date: '',
          stock_quantity: '',
          unit_price: '',
          buying_price: '',
        });

        handleClose();
      } else {
        toast.error(response.message || 'Error adding inventory');
      }
    } catch (error) {
      toast.error('Error adding inventory: ' + error.message);
    }
    setLoading(false);
  };

  return (
    <Modal show={showModal} onHide={handleClose} backdrop="static" keyboard={false}>
      <Modal.Header closeButton className="model-head">
        <Modal.Title className='addAssistTitle'>
          <FaUser size={30} /> &nbsp; Add New Inventory Record
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
                  onChange={handleMedicineSelect}
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
              <Form.Group controlId="formBrand" className="formGroup">
                <Form.Label>Medicine Item</Form.Label>
                <Form.Control
                  as="select"
                  name="brand_ID"
                  value={inventoryDetails.brand_ID}
                  onChange={handleInputChange}
                  className="formControl"
                  disabled={brands.length === 0}
                >
                  <option value="">Select Item</option>
                  {brands.map((brand, index) => (
                    <option key={index} value={brand.brand_ID}>
                      {brand.brand_ID} - {brand.Brand_Name}
                    </option>
                  ))}
                </Form.Control>
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
