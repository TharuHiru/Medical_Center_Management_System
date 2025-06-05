# 🏥 Medical Center Management System

![image](https://github.com/user-attachments/assets/f1084862-4ce1-4962-909f-4729fc663f9a)

Welcome to the Medical Center Management System — a comprehensive, real-time healthcare management platform developed as a solution to reduce long waiting times and enable effective management of all kinds of data in medical centers. This project is a personal endeavor to create an intuitive system where doctors, assistants, and patients collaborate smoothly using modern web technologies.

---

## 🌟 Overview

This system offers a full suite of tools to manage appointments, prescriptions, patient records, medicine inventory, and more — all designed with real-time updates and seamless data management in mind.

* **Frontend**: Built with **Next.js** ⚛️ for a fast, scalable, and SEO-friendly React framework.
* **Backend**: Powered by Node.js 🟢 and Express.js APIs.
* **Databases**: Uses **Firebase Realtime Database** 🔥 for live appointment updates and **MySQL** 🐬 for secure, structured, and persistent data storage.

---

## 🚀 Core Features

### ⏰ Real-time Appointment Management (Firebase)

* Patients can book appointments that update instantly. 📅
* Doctors and assistants can view and manage these appointments live, ensuring efficient scheduling without conflicts. 👩‍⚕️👨‍⚕️🧑‍⚕️

### 💊 Prescription and Receipt Management

* Doctors create prescriptions for patients which are saved securely. 📝
* Once a prescription is finalized, appointment data is removed from Firebase and stored permanently in MySQL — ensuring atomic transactions and data integrity. 🔄
* Assistants can print prescriptions and receipts directly from the system. 🖨️

### 🏥 Medicine Inventory with Notifications

* Assistants can fully manage the medicine inventory — add, update, or remove medicines. 💊
* The system automatically notifies when medicines are low in quantity or nearing expiry to prevent shortages and ensure patient safety. ⚠️📉⏳

### 👤 Patient Profile and Data Management

* Doctors and assistants can add, update, and view patient profiles and medical history. 📋
* Patients can manage their own profiles and create shared family accounts for easy access without multiple logins. 👨‍👩‍👧‍👦

### 📊 Reports and Analytics

* Doctors have access to reports on appointments, prescriptions, and overall system usage. 📈
* These insights help with better management and informed decision-making. 🧠

### 🔐 User Roles and Permissions

* **Doctors**: Manage assistants, prescriptions, patient histories, and reports.
* **Assistants**: Handle patient data, inventory, print documents, and receive alerts.
* **Patients**: Book appointments, manage personal and family profiles.

---

## ⚙️ How It Works

* **Frontend**: Built with Next.js for a responsive and dynamic user experience.
* **Realtime Data**: Firebase manages appointment scheduling in real-time.
* **Data Persistence**: When prescriptions are issued, Firebase appointment entries are removed and corresponding data is stored atomically in MySQL.
* **Inventory Alerts**: The system automatically tracks medicine stock levels and expiration dates, sending alerts to assistants for proactive inventory management.
* **Printing**: Prescriptions, receipts, and reports can be printed directly through the interface.

---

## 🛠️ Technologies Used

* **Frontend**: Next.js (React), HTML, CSS
* **Backend**: Node.js, Express.js
* **Databases**: Firebase Realtime Database, MySQL

---

## 🚀 Installation and Setup (Summary)

1. Clone the repository. 📥
2. Install Node.js dependencies. 📦
3. Set up Firebase project and configure the Realtime Database. 🔧
4. Create and configure the MySQL database. 🗄️
5. Update environment variables with Firebase and MySQL credentials. 🔑
6. Run backend server. ▶️
7. Run Next.js frontend. 🌐


## 🙏 Acknowledgments

This project is a solo effort to develop an effective medical center management platform that bridges real-time updates with robust data handling, designed to improve operational workflows for healthcare professionals and patients alike.

---
