import React, { useState, useEffect } from "react";
import { fetchMedicineCategory } from "../services/inventoryService";

export default function BillingForm({
  prescriptionRows,
  handleRowChange,
  removeRow,
  addRow,
  billingRef,
  prescriptionId,
}) {
  const [medicines, setMedicines] = useState([]);

  // Fetch medicines when the component mounts
  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const response = await fetchMedicineCategory();
        if (response.success) {
          setMedicines(response.data); // Set medicines in the state
        } else {
          alert("Failed to load medicines");
        }
      } catch (error) {
        alert("Error fetching medicines: " + error.message);
      }
    };

    fetchMedicines(); // Call the API when the component mounts
  }, []);

  return (
    <div className="container mt-5" ref={billingRef}>
      <div className="row justify-content-center">
        <div className="col-md-10">
          <div className="card shadow p-4 rounded">
            <h4 className="text-center mb-4">Billing Details</h4>
            <form>
              <div className="mb-3">
                <label htmlFor="serviceCharge" className="form-label">Service Charge:</label>
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
                          value={row.medicine_ID}
                          onChange={(e) =>
                            handleRowChange(index, "medicine_ID", e.target.value)
                          }
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
                        <input
                          type="text"
                          className="form-control"
                          value={row.dosage}
                          onChange={(e) =>
                            handleRowChange(index, "dosage", e.target.value)
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          className="form-control"
                          value={row.units}
                          onChange={(e) =>
                            handleRowChange(index, "units", e.target.value)
                          }
                        />
                      </td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => removeRow(index)}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="mb-3 text-end">
                <button type="button" className="btn btn-outline-primary" onClick={addRow}>
                  + Add Medicine
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
