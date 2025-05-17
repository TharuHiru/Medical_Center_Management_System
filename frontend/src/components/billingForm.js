import React, { useState, useEffect } from "react";
import { fetchMedicineCategory } from "@/services/inventoryService";
import { fetchInventoryByMedicineID , savePaymentData } from "@/services/billingService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "@/Styles/table.css";
import Select from "react-select";
import Receipt from "./receipt";

export default function BillingForm({prescriptionRows,handleRowChange,removeRow,addRow,billingRef,prescriptionId,onCloseAll}) {
  const [medicines, setMedicines] = useState([]);
  const [inventoryList, setInventoryList] = useState([]);
  const [selectedInventory, setSelectedInventory] = useState({});
  const [showReceipt, setShowReceipt] = useState(false);
  const [billingData, setBillingData] = useState({ serviceCharge: 0, medicines: [] });

  // Fetch medicines when the component loads
  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const response = await fetchMedicineCategory();
        if (response.success) {
          setMedicines(response.data || [] ); // Set medicines in the state
        } else {
          toast.error("Failed to load medicines");
          setMedicines([]);
        }
      } catch (error) {
        toast.error("Error fetching medicines: " + error.message);
        setMedicines([]);
      }
    };
    fetchMedicines(); // Call the API when the component loads
  }, []);


  // Handle medicine selection from the combo box
  const handleMedicineChange = async (index, medicine_ID) => {
    handleRowChange(index, "medicine_ID", medicine_ID); // Update the selected medicine ID for the row
  
    const ensureInventoryListSize = (list, requiredIndex) => {
      const updated = [...list];
      while (updated.length <= requiredIndex) {
        updated.push([]);
      }
      return updated;
    };
  
    if (medicine_ID) {
      try {
        const response = await fetchInventoryByMedicineID(medicine_ID);
  
        let updatedInventoryList = ensureInventoryListSize(inventoryList, index);
  
        if (response.success && Array.isArray(response.data)) {
          updatedInventoryList[index] = response.data;
        } else {
          updatedInventoryList[index] = [];
          toast.error("Failed to load inventory");
        }
  
        setInventoryList(updatedInventoryList);
      } catch (error) {
        const updatedInventoryList = ensureInventoryListSize(inventoryList, index);
        updatedInventoryList[index] = [];
        setInventoryList(updatedInventoryList);
        toast.error("Error fetching inventory: " + error.message);
      }
    } else {
      const updatedInventoryList = ensureInventoryListSize(inventoryList, index);
      updatedInventoryList[index] = [];
      setInventoryList(updatedInventoryList);
    }
  };  

  // Log the billing data whenever it changes
  useEffect(() => {
    console.log("Updated billingData:", billingData);
  }, [billingData]);
  

  // Handle inventory selection from the inventory table
  const handleInventorySelection = (index, inventory_ID) => {
    handleRowChange(index, "inventory_ID", inventory_ID);
    setSelectedInventory((prev) => ({
      ...prev,
      [index]: inventory_ID, // Store the selected inventory ID for the row
    }));
  };

  // Add a new row when "Add Medicine" is clicked
  const handleAddRow = () => {
    // Reset prescriptionRows state with a new row and empty fields for each medicine
    const newRow = {
      medicine_ID: "", 
      units: "",
      inventory_ID: "", 
    };

     addRow([newRow]); // Add the new row to prescriptionRows

    // Reset inventory list to empty for this new row
    setInventoryList((prev) => [...prev, []]); // emply list
  };

  // Remove a row
  const handleRemoveRow = (index) => {
    removeRow(index); // Remove the row by its index
    setInventoryList((prev) => prev.filter((_, i) => i !== index)); // Remove corresponding inventory for this row
  };


  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

     // Validate doctor fee
  const serviceCharge = parseFloat(e.target.serviceCharge.value);
    if (serviceCharge <= 0) {
      toast.error("Doctor fee must be greater than 0");
      return;
    }

    // Validate each row
  for (let i = 0; i < prescriptionRows.length; i++) {
    const row = prescriptionRows[i];
    // Validate inventory selection
    if (!row.inventory_ID) {
      toast.error(`Please select an inventory record for row ${i + 1}`);
      return;
    }    // Validate units
    const units = parseFloat(row.units);
    if (isNaN(units)) {
      toast.error(`Please enter valid units for row ${i + 1}`);
      return;
    }
    if (units <= 0) {
      toast.error(`Units must be greater than 0 for row ${i + 1}`);
      return;
    }
  }
    const billingDetails = {
      serviceCharge: e.target.serviceCharge.value,
      prescriptionId: prescriptionId,
      medicines: prescriptionRows.map((row, index) => {
        const inventory = inventoryList[index]?.find((inv) => inv.inventory_ID === row.inventory_ID);
        return {
          inventory_ID: row.inventory_ID,
          units: row.units,
          brandName: inventory?.Brand_Name || "",
          unit_price: inventory?.unit_price || 0,
        };
      }),
    };
  
    console.log("Billing details:", billingDetails); // Debug log
  
    try {
      const response = await savePaymentData(billingDetails); // Save billing details to the backend
      if (response.success) {
        toast.success("Billing details saved successfully!");
  
        // Update state
        setBillingData({
          serviceCharge: billingDetails.serviceCharge,
          medicines: billingDetails.medicines,
        });
  
        // Delay showing receipt to allow billingData to update
        setTimeout(() => {
          console.log("Updated billing data (after delay):", billingDetails);
          setShowReceipt(true);
        }, 0);
  
      } else {
        toast.error("Failed to save billing details");
      }
    } catch (error) {
      toast.error("Error saving billing details: " + error.message);
    }
  };
  

  return (
    <div className="container mt-5" ref={billingRef}>
      <div className="row justify-content-center">
        <div className="col-md-10">
          <div className="card shadow p-4 rounded">
            <h4 className="text-center mb-4">Billing Details</h4>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="serviceCharge" className="form-label">
                  Doctor Fee :
                </label>
                <input type="number" className="form-control" id="serviceCharge" required />
              </div>

              {/* Medicine selection table */}
              <h5 className="text-center mt-4">Medicines</h5>
              <table className="table table-bordered">
                <thead className="table-light">
                  <tr>
                    <th>Medicine</th>
                    <th>Inventory</th>
                    <th>Units</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {prescriptionRows.map((row, index) => (
                    <tr key={index}>
                    <td>
                      <Select
                        className="basic-single"
                        classNamePrefix="select"
                        placeholder="Select Medicine"
                        options={medicines.map((med) => ({
                          value: med.medicine_ID,
                          label: med.medicine_Name,
                        }))}
                        value={
                          medicines
                            .map((med) => ({
                              value: med.medicine_ID,
                              label: med.medicine_Name,
                            }))
                            .find((option) => option.value === row.medicine_ID) || null
                        }
                        onChange={(selectedOption) =>
                          handleMedicineChange(index, selectedOption ? selectedOption.value : "")
                        }
                        isClearable
                      />
                    </td>
                      <td>
                        {Array.isArray(inventoryList[index]) && inventoryList[index].length > 0 ? (
                          <table className="table-hover table-sm table-bordered mt-2 mb-0">
                            <thead className="table-light">
                              <tr>
                                <th>Inventory ID</th>
                                <th>Brand Name</th>
                                <th>Quantity</th>
                                <th>Exp Date</th>
                                <th>Unit Price</th>
                              </tr>
                            </thead>
                            <tbody>
                              {inventoryList[index].map((inv) => (
                                <tr
                                  key={inv.inventory_ID}
                                  onClick={() => handleInventorySelection(index, inv.inventory_ID)}
                                  className={selectedInventory[index] === inv.inventory_ID ? "selected" : ""}
                                >
                                  <td>{inv.inventory_ID}</td>
                                  <td>{inv.Brand_Name}</td>
                                  <td>{inv.stock_quantity}</td>
                                  <td>{inv.Exp_Date}</td>
                                  <td>{inv.unit_price}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        ) : (
                          <div className="text-danger mt-2 small">No records found</div>
                        )}
                      </td>
                      <td>
                        <input
                          type="number"
                          className="form-control"
                          value={row.units}
                          onChange={(e) => handleRowChange(index, "units", e.target.value)}
                        />
                      </td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => handleRemoveRow(index)}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="mb-3 text-end">
                <button type="button" className="btn btn-outline-primary  " onClick={handleAddRow}>
                  + Add Medicine
                </button>
              </div>
              <div className="text-center mt-4">
                <button type="submit" className="btn btn-primary loginBtn">
                  Submit and print the Bill
                </button>
              </div>
          </form>
        </div>
      </div>
    </div>
    {/* Success Modal */}
    {showReceipt && (
      <Receipt
        show={showReceipt}
        //the assistant should not be able to accidently close the receipt model
        onHide={() => {}} 
        backdrop="static"
        keyboard={false}
        serviceCharge={billingData.serviceCharge}
        medicines={billingData.medicines}
        prescriptionId={prescriptionId}
        onConfirmClose={onCloseAll} 
      />
    )}
  </div>
  );
  }
