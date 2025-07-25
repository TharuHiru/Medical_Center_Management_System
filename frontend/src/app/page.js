import styles from './page.module.css'; // Adjust the CSS module path if necessary
import WelcomePage from '../app/welcomePage/page' // Adjust the path based on your structure
//import { metadata } from "../app/metaData"; // ✅ Import metadata separately
import { ToastContainer } from 'react-toastify';



export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
      <ToastContainer />
      <WelcomePage />
      </main>
    </div>
  );
}
