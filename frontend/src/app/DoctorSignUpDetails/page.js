"use client";

import React, { useState ,useEffect} from "react";
import { useRouter } from "next/navigation";
import BackNavbar from '@/components/backNavBar';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { registerDoctorStep2 } from '@/services/authService';
import { useSearchParams } from "next/navigation";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const DoctorSignUpDetails = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailFromURL = searchParams.get("email") || '';

  const [password, setPassword] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [rePassword, setRePassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);
  const [showSecretKey, setShowSecretKey] = useState(false);

  useEffect(() => {
    if (!emailFromURL) {
      toast.error("Please complete registration step 1 first");
      router.push('/DoctorSignUp');
    }
  }, [emailFromURL, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const secret_Key = process.env.NEXT_PUBLIC_SECRET_KEY;

    // Password validation regex:
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    
    if (secretKey !== secret_Key) {
      toast.error("Invalid Secret Key");
    } 
    else if (password !== rePassword) {
      toast.error("Passwords do not match");
    } 
    else if (!passwordRegex.test(password)) {
    toast.error("Password must be at least 8 characters long and include letters, numbers, and a special character.");
  }
    else {
      try {
        const formData = {
          email: emailFromURL, // Use the email from Step 1
          password,
          secretKey: secret_Key,
        };
        
        const response = await registerDoctorStep2(formData);
        if (response.success) {
          toast.success("Account Created Successfully");
          router.push('/DoctorLogin');
        } else {
          toast.error(response.message || "Something went wrong.");
        }
      } catch (error) {
        toast.error(error.message || "Something went wrong.");
      }
    }
  };

  return (
    <div>
      <BackNavbar />
      <section className="container d-flex justify-content-center">
        <div className="col-md-6 loginForm">
          <h2 className="text-center mb-4">Create Doctor Account</h2>
          <p className="text-center mb-4">Registering as: {emailFromURL}</p>
          
          <form className="temporyLoginForm" onSubmit={handleSubmit}>

            {/* Password */}
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password:</label>
              <div className="input-group">
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control"
                  id="register-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <span className="input-group-text" style={{ cursor: "pointer" }} onClick={() => setShowPassword(!showPassword)}>
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </span>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="mb-3">
              <label htmlFor="rePassword" className="form-label">Confirm Password:</label>
              <div className="input-group">
                <input
                  type={showRePassword ? "text" : "password"}
                  className="form-control"
                  id="register-re-password"
                  value={rePassword}
                  onChange={(e) => setRePassword(e.target.value)}
                  required
                />
                <span className="input-group-text" style={{ cursor: "pointer" }} onClick={() => setShowRePassword(!showRePassword)}>
                  <FontAwesomeIcon icon={showRePassword ? faEyeSlash : faEye} />
                </span>
              </div>
            </div>

            {/* Secret Key */}
            <div className="mb-3">
              <label htmlFor="secretKey" className="form-label">Secret Key:</label>
              <div className="input-group">
                <input
                  type={showSecretKey ? "text" : "password"}
                  className="form-control"
                  id="secretKey"
                  value={secretKey}
                  onChange={(e) => setSecretKey(e.target.value)}
                  required
                />
                <span className="input-group-text" style={{ cursor: "pointer" }} onClick={() => setShowSecretKey(!showSecretKey)}>
                  <FontAwesomeIcon icon={showSecretKey ? faEyeSlash : faEye} />
                </span>
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-100 loginBtn">
              Complete Registration
            </button>
          </form>

        </div>
      </section>
    </div>
  );
}

export default DoctorSignUpDetails;