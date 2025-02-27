import React from 'react';
import { useRouter } from 'next/router'; // Import useRouter from Next.js
import styles from '../../Styles/AssistantDashboard.module.css'; // Adjust if using CSS Modules
import DoctorNavBar from '../../components/assistantSideBar';
import { FaUser, FaBoxes } from 'react-icons/fa'; // Import icons

function DoctorDashboard() {
  const router = useRouter();
  const { username } = router.query; // Retrieve username from query parameters

  // Function to handle logout
  const logout = () => {
    // Logout logic (e.g., clearing tokens)
    console.log('Logged out');
    router.push('/login'); // Use router.push for navigation
  };

  return (
    <div className={styles.dashboardContainer}> {/* Use styles if using CSS Modules */}
      {/* Vertical Navigation Bar */}
      <DoctorNavBar onLogout={logout} /> {/* Pass the logout function as a prop */}

      <div className={styles.contentArea}>
        <div className={styles.greetingContainer}>
          <h5 className={styles.assistantName}>Hello, {username || 'Doctor'}</h5>
          <p className={styles.greetingText}>Welcome back!</p>
        </div>

        <div className={styles.buttonContainer}>
          <button className={`${styles.btn} ${styles.btnPrimary} ${styles.btnAddPatient}`}>
            <FaUser size={40} />
            <br />
            Add new Assistant
          </button>

          <button className={`${styles.btn} ${styles.btnPrimary} ${styles.btnAddInventory}`}>
            <FaBoxes size={40} />
            <br />
            View Inventory
          </button>
        </div>
      </div>
    </div>
  );
}

export default DoctorDashboard;
