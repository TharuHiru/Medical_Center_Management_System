import { initializeApp } from "firebase/app";
import { getFirestore, collection, query, orderBy, onSnapshot, addDoc } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBtdELB3hpro1-b_YqUKdmL0iQeo1G0nlQ",
    authDomain: "mc-queue-management.firebaseapp.com",
    projectId: "mc-queue-management",
    storageBucket: "mc-queue-management.firebasestorage.app",
    messagingSenderId: "1056793146882",
    appId: "1:1056793146882:web:f61f3f3bd4de392ba6d91b",
    measurementId: "G-92LX9WQH52"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, collection, query, orderBy, onSnapshot, addDoc };