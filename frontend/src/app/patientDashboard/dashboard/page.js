"use client";

import PatientSidebar  from "../../../components/patientSideBar"; 

   //Handle logout function
   const logout = () => {
    console.log("Logged out");
  };

    const dashboard = () => {
        return (
          <>
            <PatientSidebar  onLogout={logout} />
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <h1>Welcome to Dashboard</h1>
            <p>This is your dashboard where you can manage your activities.</p>
          </div>
          </>
        );
      };

  
  export default dashboard;
  