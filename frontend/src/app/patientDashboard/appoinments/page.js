import { useEffect, useState } from "react";
import { db } from "../config/firebase";
import { collection, onSnapshot } from "firebase/firestore";

const Queue = () => {
  const [queue, setQueue] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "appointments"), (snapshot) => {
      const queueData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setQueue(queueData);
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  return (
    <div>
      <h2>Live Queue</h2>
      <ul>
        {queue.map((patient, index) => (
          <li key={patient.id}>
            {index + 1}. {patient.name} (Status: {patient.status})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Queue;
