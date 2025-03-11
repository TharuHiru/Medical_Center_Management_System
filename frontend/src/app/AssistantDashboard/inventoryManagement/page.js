"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "../../../Styles/AssistantDashboard.css";
import "../../../Styles/loginForms.css";
import AssistNavBar from "../../../components/assistantSideBar";
import { FaPlus, FaSearch } from "react-icons/fa";
import AddInventoryModal from "../../../components/addInventoryModel";
import { fetchInventory } from "../../../services/inventoryService";

function AssistantDashboardInventory() {
  const router = useRouter(); // create a router instance

  // Function to handle logout
  const logout = () => {
    console.log("Logged out");
    router.push("/login"); // Use router.push for navigation
  };

  // State for Add Patient Modal
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
  const filteredInventory = inventory.filter((inventory) => {
    return Object.values(inventory).some(
      (value) =>
        value &&
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

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

        {/* Search Box */}
        <h2>&nbsp; &nbsp; Inventory Details</h2>
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

        {/* Patient Table */}
        <div className="patient-table-container">
          <div className="table-responsive-custom">
            <table className="table table-striped patient-data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Batch_No</th>
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
                    <tr key={inventory.id}>
                      <td>{inventory.name}</td>
                      <td>{inventory.batch_no}</td>
                      <td>{inventory.exp_date}</td>
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
