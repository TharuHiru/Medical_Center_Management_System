// ✅ Create an Appointment 
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, setDoc, doc,deleteDoc } from "firebase/firestore";

// Create temporary patient Appointment
const getIdentifier = (name, phone) => `${name.trim()}_${phone.trim()}`;
const getFormattedDate = (date) => date.toISOString().split("T")[0];

/**
 * Upgrade a temporary appointment to a permanent one.
 * @param {Object} appt - The original temporary appointment object.
 * @param {string} newPatientID - The new registered patient ID.
 * @returns {Promise<void>}
 */

export const upgradeTemporaryAppointment = async (appt, newPatientID) => {
  if (!appt || !newPatientID) throw new Error("Missing appointment data or patient ID.");

  const newDocId = `${appt.appointmentDate}_${newPatientID}`;

  // Step 1: Create new permanent appointment
  await setDoc(doc(db, "appointments", newDocId), {
    id: newPatientID,
    appointmentDate: appt.appointmentDate,
    createdAt: appt.createdAt || new Date(),
    status: appt.status || "pending",
  });

  // Step 2: Delete old temporary appointment doc
  if (appt.docId) {
    await deleteDoc(doc(db, "appointments", appt.docId));
  }

  // Step 3: Delete temporary patient document (based on contact number)
  if (appt.phone) {
    await deleteDoc(doc(db, "temporypatint", appt.phone));
  }
};

export const checkExistingAppointment = async (name, phone, selectedDate) => {
  const dateStr = getFormattedDate(selectedDate);
  const q = query(
    collection(db, "appointments"),
    where("appointmentDate", "==", dateStr),
    where("phone", "==", phone)
  );
  const docs = await getDocs(q);
  return !docs.empty;
};

export const createTemporaryAppointment = async (name, phone, selectedDate) => {
  const identifier = getIdentifier(name, phone);
  const dateStr = getFormattedDate(selectedDate);
  const docId = `${dateStr}_${phone}`; // date_phone as ID

  const appointmentRef = doc(db, "appointments", docId);
  await setDoc(appointmentRef, {
    id: identifier,
    name,
    phone,
    appointmentDate: dateStr,
    createdAt: new Date(),
    status: "pending",
    temporary: true,
  });
};

export const createAppointment = async (patientID, appointmentDate) => {
  const docID = `${appointmentDate}_${patientID}`; // unique per day per patient
  const appointmentRef = doc(db, "appointments", docID);

  const existing = await getDoc(appointmentRef);
  if (existing.exists()) {
    throw new Error("Appointment already exists for this patient on this date.");
  }

  await setDoc(appointmentRef, {
    id: patientID,
    appointmentDate,
    status: "pending",
    createdAt: serverTimestamp(),
  });
};