"use client";
import React, { useState, useEffect } from "react";
import { db } from "../../../lib/firebase";
import {collection,query,orderBy,onSnapshot,deleteDoc,doc,} from "firebase/firestore";
import { createAppointment } from "../../../services/appointmentService";
import { ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useAuth } from "../../../context/AuthContext";
import PatientSidebar  from "../../../components/patientSideBar";

