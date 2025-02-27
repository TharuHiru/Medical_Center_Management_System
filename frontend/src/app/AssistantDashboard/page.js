import React from 'react';
import { useRouter } from 'next/router'; // Import useRouter from Next.js
import styles from '../../Styles/AssistantDashboard.module.css'; // Adjust if using CSS Modules
import AssistNavBar from '../../components/assistantSideBar';
import { FaUser, FaBoxes, FaPlay } from 'react-icons/fa'; // Import icons

function AssistantDashboard() {
  const router = useRouter();

  // Function to handle logout
  const logout = () => {
    // Logout logic (e.g., clearing tokens)
    console.log('Logged out');
    router.push('/login'); // Use router.push for navigation
  };

  return (
    <div className={styles.dashboardContainer}> {/* Use styles if using CSS Modules */}
      {/* Vertical Navigation Bar */}
      <AssistNavBar onLogout={logout} /> {/* Pass the logout function as a prop */}

      <div className={styles.contentArea}>
        <div className={styles.greetingContainer}>
          <h5 className={styles.assistantName}>Hello, Assistant Name</h5>
          <p className={styles.greetingText}>Welcome back!</p>
        </div>

        {/* Three Buttons */}
        <div className={styles.buttonContainer}>
          <button className={`${styles.btn} ${styles.btnPrimary} ${styles.btnAddPatient}`}>
            <FaUser size={40} />
            <br />
            Add new Patient
          </button>

          <button className={`${styles.btn} ${styles.btnPrimary} ${styles.btnAddInventory}`}>
            <FaBoxes size={40} />
            <br />
            Add new Inventory
          </button>

          <button className={`${styles.btn} ${styles.btnPrimary} ${styles.btnStartQueue}`}>
            <FaPlay size={40} />
            <br />
            <h5>Start Queue</h5>
          </button>
        </div>
      </div>
    </div>
  );
}

export default AssistantDashboard;
