import React, { useState, useEffect } from "react";
import { fetchMedicineCategory } from "../services/inventoryService";
import { fetchInventoryByMedicineID , savePaymentData } from "../services/billingService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "../Styles/table.css";

export default function BillingForm({prescriptionRows,handleRowChange,removeRow,addRow,billingRef,prescriptionId,}) {
  const [medicines, setMedicines] = useState([]);
  const [inventoryList, setInventoryList] = useState([]);
  const [selectedInventory, setSelectedInventory] = useState({});

  // Fetch medicines when the component mounts
  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const response = await fetchMedicineCategory();
        if (response.success) {
          setMedicines(response.data); // Set medicines in the state
        } else {
          toast.error("Failed to load medicines");
        }
      } catch (error) {
        toast.error("Error fetching medicines: " + error.message);
      }
    };
    fetchMedicines(); // Call the API when the component mounts
  }, []);

  // Handle medicine selection from the combo box
  const handleMedicineChange = async (index, medicine_ID) => {
    handleRowChange(index, "medicine_ID", medicine_ID); // Update the selected medicine ID for the row

    if (medicine_ID) {
      try {
        const response = await fetchInventoryByMedicineID(medicine_ID); // Get inventory for the selected medicine ID

        if (response.success && Array.isArray(response.data)) {
          setInventoryList((prev) => {
            const updated = [...prev];
            updated[index] = response.data; // Store inventory for the selected medicine
            return updated;
          });
        } else {
          setInventoryList((prev) => {
            const updated = [...prev];
            updated[index] = [];
            return updated;
          });
          toast.error("Failed to load inventory");
        }
      } catch (error) {
        toast.error("Error fetching inventory: " + error.message);
      }
    } else {
      setInventoryList((prev) => {
        const updated = [...prev];
        updated[index] = [];
        return updated;
      });
    }
  };

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

    // Add the new row to prescriptionRows
    addRow([newRow]); 

    // Reset inventory list to empty for this new row
    setInventoryList((prev) => [...prev, []]); // emply list
  };

  // Remove a row
  const handleRemoveRow = (index) => {
    removeRow(index); // Remove the row by its index
    setInventoryList((prev) => prev.filter((_, i) => i !== index)); // Remove corresponding inventory for this row
  };

  // send the billing details to the backend
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    const billingDetails = {
      serviceCharge: e.target.serviceCharge.value,
      prescriptionId: prescriptionId,
      medicines: prescriptionRows.map((row) => ({
        inventory_ID: row.inventory_ID,
        units: row.units,
      })),
    };

    try {
      const response = await savePaymentData(billingDetails); // Save billing details to the backend
      if (response.success) {
        toast.success("Billing details saved successfully!");
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
                  Service Charge:
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
                        <select
                          className="form-select"
                          value={row.medicine_ID || ""} // Ensure the value is an empty string if no medicine is selected
                          onChange={(e) => handleMedicineChange(index, e.target.value)}
                        >
                          <option value="">Select Medicine</option>
                          {medicines.map((med) => (
                            <option key={med.medicine_ID} value={med.medicine_ID}>
                              {med.medicine_Name}
                            </option>
                          ))}
                        </select>
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
                          <div className="text-muted mt-2">No records found</div>
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
  </div>
  );
}
