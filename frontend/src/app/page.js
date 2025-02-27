import styles from './page.module.css'; // Adjust the CSS module path if necessary
import WelcomePage from '../app/welcomePage/page' // Adjust the path based on your structure

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        {/* Replace this with your actual WelcomePage component */}
        <WelcomePage />
      </main>
    </div>
  );
}
