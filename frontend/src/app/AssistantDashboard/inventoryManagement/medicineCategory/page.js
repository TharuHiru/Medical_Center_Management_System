"use client";

import React, { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import "@/Styles/AssistantDashboard.css";
import "@/Styles/loginForms.css";
import "@/Styles/pages.css";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AssistNavBar from "@/components/assistantSideBar";
import Select from "react-select";
import {fetchBrandsByMedicineID, addMedicineCategory, addMedicineBrand, fetchMedicineCategory} from "../../../../services/inventoryService";

const MedicineCategoryPage = () => {
  const [newCategory, setNewCategory] = useState("");
  const [newBrand, setNewBrand] = useState("");
  const [selectedMedicine, setSelectedMedicine] = useState("");
  const [medicines, setMedicines] = useState([]);
  const [brands, setBrands] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleNewCategoryChange = (event) => setNewCategory(event.target.value);
  const handleNewBrandChange = (event) => setNewBrand(event.target.value);

  const handleAddNewCategory = async () => {

  const trimmedCategory = newCategory.trim();
  // Required check
  if (trimmedCategory === "") {
    toast.error("Please enter a category.");
    return;
  }

  // Length check
  if (trimmedCategory.length > 50) {
    toast.error("Category name should not exceed 50 characters.");
    return;
  }

  // Character validation
  const categoryPattern = /^[a-zA-Z0-9 ]+$/;
  if (!categoryPattern.test(trimmedCategory)) {
    toast.error("Category name can only contain letters, numbers, and spaces.");
    return;
  }

  try {
    setIsLoading(true);
    const response = await addMedicineCategory({
      medicine_name: trimmedCategory,
    });
    if (response.success) {
      toast.success("Category added successfully!");
      setNewCategory("");
      fetchMedicines(); // Refresh dropdown
    } else {
      toast.error("Failed to add category.");
    }
  } catch (error) {
      const errorMessage = error?.response?.data?.message || "An error occurred. Please try again.";
      toast.error(errorMessage);
  } finally {
      setIsLoading(false);
    }
};


  const handleAddNewBrand = async () => {
    if (newBrand.trim() !== "" && selectedMedicine !== "") {
      try {
        setIsLoading(true);
        const response = await addMedicineBrand({
          brand_name: newBrand,
          medicine_ID: selectedMedicine,
        });
        if (response.success) {
          alert("Item added successfully!");
          setNewBrand("");
          // Refresh brand list after adding
          const updated = await fetchBrandsByMedicineID(selectedMedicine);
          if (updated.success) setBrands(updated.data);
        } else {
          alert("Failed to add item.");
        }
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        alert("An error occurred. Please try again.");
      }
    } else {
      alert("Please select a medicine and enter an item name.");
    }
  };

  const fetchMedicines = async () => {
    try {
      setIsLoading(true);
      const response = await fetchMedicineCategory();
      if (response.success) {
        setMedicines(response.data);
      } else {
        alert("Failed to load medicines");
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      alert("Error fetching medicines: " + error.message);
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, []);

  const customSelectStyles = {
    control: (provided) => ({
      ...provided,
      borderColor: '#2c6a75',
      boxShadow: 'none',
      '&:hover': {
        borderColor: '#5b949e',
      },
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#2c6a75' : state.isFocused ? '#5b949e22' : null,
      color: state.isSelected ? 'white' : '#333',
    }),
  };

  return (
    <div className="dashboard-container">
      <AssistNavBar />

      <div className="content-area p-3">
        <h1 className="page-header text-center">Manage Medicine Categories</h1>

        <div className="container">
          {/* Add New Medicine Category */}
          <Row className="justify-content-center">
            <Col lg={6} md={8}>
              <div className="new-category-group">
                <h4 className="new-category-group-label">Add New Medicine</h4>
                <input
                  className="search-input-text form-control mb-3"
                  type="text"
                  placeholder="Enter new category"
                  value={newCategory}
                  onChange={handleNewCategoryChange}
                />
                <div className="text-center">
                  <button 
                    className="add-category-btn" 
                    onClick={handleAddNewCategory}
                    disabled={isLoading}
                  >
                    {isLoading ? "Adding..." : "Add Category"}
                  </button>
                </div>
              </div>
            </Col>
          </Row>

          {/* Add Brand and Display Brands */}
          <Row className="justify-content-center mt-4">
            <Col lg={6} md={8}>
              <div className="new-category-group">
                <h4 className="new-category-group-label">Add Item to a Medicine</h4>
                <Select
                  styles={customSelectStyles}
                  className="mb-3"
                  placeholder="Select Medicine"
                  options={medicines.map((medicine) => ({
                    value: medicine.medicine_ID,
                    label: medicine.medicine_Name
                  }))}
                  onChange={(selectedOption) => {
                    const selectedID = selectedOption ? selectedOption.value : "";
                    setSelectedMedicine(selectedID);
                    if (selectedID) {
                      setIsLoading(true);
                      fetchBrandsByMedicineID(selectedID).then((response) => {
                        if (response.success) {
                          setBrands(response.data);
                        } else {
                          setBrands([]);
                          alert("Failed to fetch item names.");
                        }
                        setIsLoading(false);
                      }).catch(() => {
                        setBrands([]);
                        setIsLoading(false);
                        alert("An error occurred while fetching item names.");
                      });
                    } else {
                      setBrands([]);
                    }
                  }}
                  isClearable
                />
                <div className="brand-list-container mb-3">
                  <div className="brand-list-header">
                    <h5>Available Items</h5>
                    <span className="item-count">{brands.length} items</span>
                  </div>
                  
                  {isLoading ? (
                    <div className="loading-container">
                      <div className="loading-spinner"></div>
                      <p>Loading items...</p>
                    </div>
                  ) : brands.length > 0 ? (
                    <div className="items-grid">
                      {brands.map((brand, index) => (
                        <div key={index} className="item-card">
                          <div className="item-icon">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M13.333 4L6 11.333L2.667 8" stroke="#2c6a75" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                          <span className="item-name">{brand.Brand_Name}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="empty-state">
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#6c757d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 8V12" stroke="#6c757d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 16H12.01" stroke="#6c757d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <p className="text-muted">No items available for this medicine</p>
                    </div>
                  )}
                </div>
                <hr />
                <input
                  className="search-input-text form-control mb-3"
                  type="text"
                  placeholder="Enter Item name"
                  value={newBrand}
                  onChange={handleNewBrandChange}
                />
                <div className="text-center">
                  <button 
                    className="add-category-btn" 
                    onClick={handleAddNewBrand}
                    disabled={isLoading || !selectedMedicine}
                  >
                    {isLoading ? "Adding..." : "Add Item"}
                  </button>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};

export default MedicineCategoryPage;