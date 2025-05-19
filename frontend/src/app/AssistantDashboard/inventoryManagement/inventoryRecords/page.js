"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "@/Styles/AssistantDashboard.css";
import "@/Styles/loginForms.css";
import "@/Styles/tableStyle.css";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Row, Col } from "react-bootstrap";
import AssistNavBar from "@/components/assistantSideBar";
import { FaPlus, FaSearch } from "react-icons/fa";
import AddInventoryModal from "@/components/addInventoryModel";
import { fetchInventory, fetchMedicineCategory } from "@/services/inventoryService";
import Select from 'react-select';
import ProtectedRoute from '@/components/protectedRoute';

function AssistantDashboardInventory() {
  const router = useRouter();

  // Function to handle logout
  const logout = () => {
    console.log("Logged out");
    router.push("/login");
  };

  // State for Add Inventory Modal
  const [showInventoryModal, setShowInventoryModal] = useState(false);
  const handleShowInventoryModal = () => setShowInventoryModal(true);
  const handleCloseInventoryModal = () => setShowInventoryModal(false);

  const handleFormSubmit = async () => {
  try {
    console.log("Form submitted");
    await fetchInventoryData();  // Refetch the inventory data
    handleCloseInventoryModal();
    toast.success("Inventory item added successfully!");
  } catch (error) {
    console.error("Failed to refresh inventory:", error);
    toast.error("Failed to refresh inventory data");
  }
};

  // State to store inventory data
  const [inventory, setInventory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [medicineCategories, setMedicineCategories] = useState([]);
  const [selectedMedicine, setSelectedMedicine] = useState("");
  const [selectedItem, setSelectedItem] = useState("");

  // Fetch inventory function (reusable)
  const fetchInventoryData = async () => {
    try {
      const data = await fetchInventory();
      setInventory(data.data);
    } catch (error) {
      console.error("Failed to fetch inventory:", error);
    }
  };

  // Fetch inventory from the service
  useEffect(() => {
    fetchInventoryData();
}, []);

  // Helper functions for expiration checks
  const isExpired = (expDate) => {
    const today = new Date();
    const expirationDate = new Date(expDate);
    return expirationDate < today;
  };

  const isNearlyExpired = (expDate) => {
    const today = new Date();
    const oneMonthFromNow = new Date();
    oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);
    const expirationDate = new Date(expDate);
    return expirationDate >= today && expirationDate <= oneMonthFromNow;
  };

  // Date formatting function
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric'});
  };

  // Filter inventory based on search input and selected category
  const filteredInventory = inventory.filter((item) => {
    const matchesSearchTerm = Object.values(item).some(
      (value) =>
        value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );

    const matchesSelectedMedicine = !selectedMedicine || item.medicine_Name === selectedMedicine;

    const matchesSelectedItem = !selectedItem || item.Brand_Name === selectedItem;

    return matchesSearchTerm && matchesSelectedMedicine && matchesSelectedItem && item.stock_quantity > 0 && !isExpired(item.Exp_Date);
  });

  // Get unique item names for the second dropdown
  const itemOptions = [...new Set(inventory.map(item => item.Brand_Name))]
    .map(item => ({ value: item, label: item }));

  // Get expired items with quantity > 0
  const expiredItems = inventory.filter(item => 
    isExpired(item.Exp_Date) && item.stock_quantity > 0
  );

  // Notification effects
  useEffect(() => {
    const lowStockItems = inventory.filter(item => item.stock_quantity > 0 && item.stock_quantity < 50);
    if (lowStockItems.length > 0) {
      toast.warning(`${lowStockItems.length} items are low on stock!`);
    }

    const expiredItems = inventory.filter(item => isExpired(item.Exp_Date) && item.stock_quantity > 0);
    if (expiredItems.length > 0) {
      toast.error(`${expiredItems.length} items have expired!`, {
        autoClose: false
      });
    }

    const nearlyExpiredItems = inventory.filter(item => isNearlyExpired(item.Exp_Date));
    if (nearlyExpiredItems.length > 0) {
      toast.warning(`${nearlyExpiredItems.length} items will expire within a month!`);
    }
  }, [inventory]);

  // Fetch Medicine Categories
  useEffect(() => {
    const getCategories = async () => {
      try {
        const response = await fetchMedicineCategory();
        setMedicineCategories(response.data);
      } catch (error) {
        console.error("Failed to fetch medicine categories:", error);
      }
    };
    getCategories();
  }, []);

  // Transform medicine categories to match the Select component's format
  const categoryOptions = medicineCategories.map((category) => ({
    value: category.medicine_Name,
    label: category.medicine_Name,
  }));

  // Handle category change
  const handleCategoryChange = (selectedOption) => {
    setSelectedMedicine(selectedOption ? selectedOption.value : "");
  };

  // Handle item change
  const handleItemChange = (selectedOption) => {
    setSelectedItem(selectedOption ? selectedOption.value : "");
  };

  return (
    <ProtectedRoute>
      <div className="dashboard-container">
        <AssistNavBar onLogout={logout} />

        <div className="content-area container mt-4">
          <div className="button-container">
            <button className="btnAddPatient ms-auto" onClick={handleShowInventoryModal}>
              <FaPlus size={40} />
              &nbsp; Add New Inventory
            </button>

            <AddInventoryModal
              showModal={showInventoryModal}
              handleClose={handleCloseInventoryModal}
              handleSubmit={handleFormSubmit}
            />
          </div>
          <h1>&nbsp; Inventory Details</h1>

          <div className="top-bar">
            <Row>
              <Col md={4}>
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
                <div>
                  <label>Select Medicine:</label>
                  &nbsp;&nbsp;
                  <Select
                    className="search-input-combo"
                    options={categoryOptions}
                    value={categoryOptions.find((option) => option.value === selectedMedicine) || null}
                    onChange={handleCategoryChange}
                    isClearable
                    placeholder="Select a Medicine"
                  />
                </div>
              </Col>

              <Col md={4}>
                <div>
                  <label>Select Item:</label>
                  &nbsp;&nbsp;
                  <Select
                    className="search-input-combo"
                    options={itemOptions}
                    value={itemOptions.find((option) => option.value === selectedItem) || null}
                    onChange={handleItemChange}
                    isClearable
                    placeholder="Select an Item"
                  />
                </div>
              </Col>
            </Row>
          </div>

          {/* Main Inventory Table */}
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
                  {(filteredInventory.length > 0)  ? (
                    filteredInventory.map((inventory) => (
                      <tr key={inventory.inventory_ID}
                          className={`
                            ${inventory.stock_quantity < 50 ? "low-stock" : ""}
                            ${isNearlyExpired(inventory.Exp_Date) ? "nearly-expired" : ""}
                          `}>
                        <td>{inventory.inventory_ID}</td>
                        <td>{inventory.medicine_Name}</td>
                        <td>{inventory.Brand_Name}</td>
                        <td>
                          {formatDate(inventory.Exp_Date)}
                          {isExpired(inventory.Exp_Date) && (
                            <span className="expired-badge"> (Expired)</span>
                          )}
                          {isNearlyExpired(inventory.Exp_Date) && (
                            <span className="nearly-expired-badge"> (Expiring Soon)</span>
                          )}
                        </td>
                        <td>
                          {inventory.stock_quantity}
                          {inventory.stock_quantity < 50 && (
                            <span className="low-quantity-badge"> (Low Quantity)</span>
                          )}
                        </td>
                        <td>{inventory.unit_price}</td>
                        <td>{inventory.buying_price}</td>
                        <td>{formatDate(inventory.date_added)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8">No active inventory records found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Expired Items Table */}
          {expiredItems.length > 0 && (
            <div className="mt-5">
              <h2>Expired Items (Still in Stock)</h2>
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
                      {expiredItems.map((item) => (
                        <tr key={item.inventory_ID} className="expired">
                          <td>{item.inventory_ID}</td>
                          <td>{item.medicine_Name}</td>
                          <td>{item.Brand_Name}</td>
                          <td>
                            {formatDate(item.Exp_Date)}
                            <span className="expired-badge"> (Expired)</span>
                          </td>
                          <td>{item.stock_quantity}</td>
                          <td>{item.unit_price}</td>
                          <td>{item.buying_price}</td>
                          <td>{formatDate(item.date_added)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}

export default AssistantDashboardInventory;