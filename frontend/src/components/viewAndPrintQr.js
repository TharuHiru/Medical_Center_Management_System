import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Image from 'next/image';

// View and print QR code modal component
const ViewAndPrintQr = ({ patient, showModal, handleClose }) => {
  const [showModalState, setShowModalState] = useState(showModal);

  return showModalState ? (
    <div className="modal fade show" tabIndex="-1" aria-hidden="true" style={{ display: 'block' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Patient Details</h5>
            <button type="button" className="btn-close" onClick={handleClose}></button>
          </div>
          <div className="modal-body">
            {patient ? (
              <div>
                <p><strong>Patient ID:</strong> {patient.patientID}</p> {/* get the patient ID*/}
                <p><strong>Name:</strong> {patient.name}</p> {/* get the patient ID*/}
                {/* get the patient QR code*/}
                {patient.qrCode && ( 
                  <Image 
                    src={patient.qrCode} 
                    alt="QR Code" 
                    width={100} 
                    height={100} 
                    unoptimized // Fixes the Next.js image issue
                  />
                )}
                {/* get the patient QR link*/}
                {patient.qrPage && (
                  <p>
                    <strong>QR Page:</strong> <a href={patient.qrPage} target="_blank" rel="noopener noreferrer">View QR Page</a>
                  </p>
                )}
              </div>
            ) : (
              <p>Loading patient data...</p>
            )}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={handleClose}>Close</button>
          </div>
        </div>
      </div>
    </div>
  ) : null;
};

export default ViewAndPrintQr;
