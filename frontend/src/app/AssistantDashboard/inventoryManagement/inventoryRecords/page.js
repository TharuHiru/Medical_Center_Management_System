"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "../../../../Styles/AssistantDashboard.css";
import "../../../../Styles/loginForms.css";
import {  Row, Col } from 'react-bootstrap';
import AssistNavBar from "../../../../components/assistantSideBar";
import { FaPlus, FaSearch } from "react-icons/fa";
import AddInventoryModal from "../../../../components/addInventoryModel";
import { fetchInventory , fetchMedicineCategory ,addMedicineCategory } from "../../../../services/inventoryService";

function AssistantDashboardInventory() {
  const router = useRouter(); // create a router instance

  // Function to handle logout
  const logout = () => {
    console.log("Logged out");
    router.push("/login"); // Use router.push for navigation
  };

  // State for Add Inventory Modal
  const [showInventoryModal, setShowInventoryModal] = useState(false);
  const handleShowInventoryModal = () => setShowInventoryModal(true);
  const handleCloseInventoryModal = () => setShowInventoryModal(false);
  const handleFormSubmit = () => {
    console.log("Form submitted");
    handleCloseInventoryModal();
  };

  // State to store patient data
  const [inventory, setInventory] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // State for search input
  const [medicineCategories, setMedicineCategories] = useState([]); // Store fetched categories
  const [selectedMedicine, setSelectedMedicine] = useState(""); // Selected category

  // Fetch patients from the service
  useEffect(() => {
    const getInventory = async () => {
      try {
        const data = await fetchInventory();
        setInventory(data.data);
      } catch (error) {
        console.error("Failed to fetch patients:", error);
      }
    };
    getInventory();
  }, []);

  // Filter patients based on search input
  const filteredInventory = inventory.filter((item) => {
    const matchesSearchTerm = Object.values(item).some(
      (value) =>
        value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
  
    const matchesSelectedMedicine =
      !selectedMedicine || item.medicine_Name === selectedMedicine;
  
    return matchesSearchTerm && matchesSelectedMedicine;
  });

  // Fetch Medicine Categories
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

   // Handle dropdown selection change
   const handleCategoryChange = (event) => {
    setSelectedMedicine(event.target.value);
  };

  return (
    <div className="dashboard-container">
      {/* Vertical Navigation Bar */}
      <AssistNavBar onLogout={logout} />
     

      <div className="content-area">
        {/* Add Patient Button */}
        <div className="button-container">
          <button className="btnAddPatient ms-auto" onClick={handleShowInventoryModal}>
            <FaPlus size={40} />
            &nbsp; Add New Inventory
          </button>

          {/* Modal Component */}
          <AddInventoryModal
            showModal={showInventoryModal}
            handleClose={handleCloseInventoryModal}
            handleSubmit={handleFormSubmit}
          />
        </div>
        <h2>&nbsp; &nbsp; Inventory Details</h2>
      <div className="top-bar">
      <Row>
        <Col md={4}>
        {/* Search Box */}
        
        <div className="search-container">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search Inventory..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        </Col>
        <Col md={4}>
        {/* Medicine Category Dropdown */}
        <div>
          <label>Select Medicine:</label>
          &nbsp;&nbsp;
          <select className="search-input-combo" value={selectedMedicine} onChange={handleCategoryChange}>
            <option value=""> All Categories </option>
            {medicineCategories.map((category) => (
              <option key={category.medicine_ID} value={category.medicine_Name}>
                {category.medicine_Name}
              </option>
            ))}
          </select>
        </div>
        </Col>
    </Row>
    </div>
        {/* Patient Table */}
        <div className="patient-table-container">
          <div className="table-responsive-custom">
            <table className="table table-striped patient-data-table">
              <thead className="table-heading">
                <tr>
                  <th>Inventory ID</th>
                  <th>Medicine Name</th>
                  <th>Item Name</th>
                  <th>Exp_Date</th>
                  <th>Quantity</th>
                  <th>Unit_Price</th>
                  <th>Buying_Price</th>
                  <th>Date_Added</th>
                </tr>
              </thead>
              <tbody>
                {filteredInventory.length > 0 ? (
                  filteredInventory.map((inventory) => (
                    <tr key={inventory.inventory_ID}>
                      <td>{inventory.inventory_ID}</td>
                      <td>{inventory.medicine_Name}</td>
                      <td>{inventory.Brand_Name}</td>
                      <td>{inventory.Exp_Date}</td>
                      <td>{inventory.stock_quantity}</td>
                      <td>{inventory.unit_price}</td>
                      <td>{inventory.buying_price}</td>
                      <td>{inventory.date_added}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="11">No Inventory record found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AssistantDashboardInventory;
