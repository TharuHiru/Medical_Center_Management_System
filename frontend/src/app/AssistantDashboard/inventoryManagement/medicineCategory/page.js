"use client";

import React, { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import "../../../../Styles/AssistantDashboard.css";
import "../../../../Styles/loginForms.css";
import "../../../../Styles/pages.css";
import AssistNavBar from "../../../../components/assistantSideBar";
import {fetchBrandsByMedicineID, addMedicineCategory, addMedicineBrand,fetchMedicineCategory,} from "../../../../services/inventoryService";

const MedicineCategoryPage = () => {
  const [newCategory, setNewCategory] = useState("");
  const [newBrand, setNewBrand] = useState("");
  const [selectedMedicine, setSelectedMedicine] = useState("");
  const [medicines, setMedicines] = useState([]);
  const [brands, setBrands] = useState([]);

  const handleNewCategoryChange = (event) => setNewCategory(event.target.value);
  const handleNewBrandChange = (event) => setNewBrand(event.target.value);

  const handleAddNewCategory = async () => {
    if (newCategory.trim() !== "") {
      try {
        const response = await addMedicineCategory({
          medicine_name: newCategory,
        });
        if (response.success) {
          alert("Category added successfully!");
          setNewCategory("");
          fetchMedicines(); // Refresh dropdown
        } else {
          alert("Failed to add category.");
        }
      } catch (error) {
        alert("An error occurred. Please try again.");
      }
    }
  };

  const handleAddNewBrand = async () => {
    if (newBrand.trim() !== "" && selectedMedicine !== "") {
      try {
        const response = await addMedicineBrand({
          brand_name: newBrand,
          medicine_ID: selectedMedicine,
        });
        if (response.success) {
          alert("Brand added successfully!");
          setNewBrand("");
          // Refresh brand list after adding
          const updated = await fetchBrandsByMedicineID(selectedMedicine);
          if (updated.success) setBrands(updated.data);
        } else {
          alert("Failed to add brand.");
        }
      } catch (error) {
        alert("An error occurred. Please try again.");
      }
    } else {
      alert("Please select a medicine and enter a brand name.");
    }
  };

  const fetchMedicines = async () => {
    try {
      const response = await fetchMedicineCategory();
      if (response.success) {
        setMedicines(response.data);
      } else {
        alert("Failed to load medicines");
      }
    } catch (error) {
      alert("Error fetching medicines: " + error.message);
    }
  };

  const handleMedicineSelect = async (event) => {
    const selectedID = event.target.value;
    setSelectedMedicine(selectedID);

    if (selectedID) {
      try {
        const response = await fetchBrandsByMedicineID(selectedID);
        console.log(selectedID);
        if (response.success) {
          setBrands(response.data);
        } else {
          setBrands([]);
          alert("Failed to fetch brand names.");
        }
      } catch (error) {
        setBrands([]);
        alert("An error occurred while fetching brand names.");
      }
    } else {
      setBrands([]);
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, []);

  return (
    <div className="dashboard-container">
      <AssistNavBar />

      <div className="content-area">
        <h1 className="page-header">Manage Medicine Categories</h1>

        {/* Add New Medicine Category */}
        <Row className="justify-content-center">
          <Col md={6}>
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
                <button className="add-category-btn" onClick={handleAddNewCategory}>
                  Add Category
                </button>
              </div>
            </div>
          </Col>
        </Row>

        {/* Add Brand and Display Brands */}
        <Row className="justify-content-center mt-5">
          <Col md={6}>
            <div className="new-category-group">
              <h4 className="new-category-group-label">Add Brand to a Medicine</h4>

              <select
                className="form-control mb-3"
                value={selectedMedicine}
                onChange={handleMedicineSelect}
              >
                <option value="">Select Medicine</option>
                {medicines.map((medicine) => (
                  <option key={medicine.medicine_ID} value={medicine.medicine_ID}>
                    {medicine.medicine_Name}
                  </option>
                ))}
              </select>

              <div className="brand-list mb-3">
              <h5>Available Brands:</h5>
              {brands.length > 0 ? (
                <ul className="list-group">
                  {brands.map((brand, index) => (
                    <li key={index} className="list-group-item">
                      {brand.Brand_Name}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted">No brands available for this medicine.</p>
              )}
            </div>
            <hr></hr>
              <input
                className="search-input-text form-control mb-3"
                type="text"
                placeholder="Enter brand name"
                value={newBrand}
                onChange={handleNewBrandChange}
              />
              <div className="text-center">
                <button className="add-category-btn" onClick={handleAddNewBrand}>
                  Add Brand
                </button>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default MedicineCategoryPage;
