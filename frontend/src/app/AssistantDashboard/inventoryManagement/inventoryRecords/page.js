"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "@/Styles/AssistantDashboard.css";
import "@/Styles/loginForms.css";
import "@/Styles/tableStyle.css"
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Row, Col } from "react-bootstrap";
import AssistNavBar from "@/components/assistantSideBar";
import { FaPlus, FaSearch } from "react-icons/fa";
import AddInventoryModal from "@/components/addInventoryModel";
import { fetchInventory, fetchMedicineCategory} from "@/services/inventoryService";
import Select from 'react-select';

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

  // State to store inventory data
  const [inventory, setInventory] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // State for search input
  const [medicineCategories, setMedicineCategories] = useState([]); // Store fetched categories
  const [selectedMedicine, setSelectedMedicine] = useState(""); // Selected category

  // Fetch inventory from the service
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

  // Filter inventory based on search input and selected category
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

  // Transform medicine categories to match the Select component's format
  const categoryOptions = medicineCategories.map((category) => ({
    value: category.medicine_Name, // value of the option
    label: category.medicine_Name, // label displayed in the dropdown
  }));

  // Handle category change
  const handleCategoryChange = (selectedOption) => {
    setSelectedMedicine(selectedOption ? selectedOption.value : "");
  };

  return (
    <div className="dashboard-container">
      {/* Vertical Navigation Bar */}
      <AssistNavBar onLogout={logout} />

      <div className="content-area container mt-4">
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
        <h1>&nbsp; Inventory Details</h1>

        <div className="top-bar">
          <Row>
            <Col md={6}>
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

            <Col md={6}>
              {/* Medicine Category Dropdown (Searchable) */}
              <div>
                <label>Select Medicine:</label>
                &nbsp;&nbsp;
                <Select
                  className="search-input-combo"
                  options={categoryOptions}
                  value={categoryOptions.find((option) => option.value === selectedMedicine) || null}
                  onChange={handleCategoryChange}
                  isClearable
                  placeholder="Select a Category"
                />
              </div>
            </Col>
          </Row>
        </div>

        {/* Inventory Table */}
        <div className="table-wrapper">
          <div className="table-responsive-custom">
            <table className="table table-striped data-table">
              <thead>
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
                    <td colSpan="8">No Inventory record found</td>
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
