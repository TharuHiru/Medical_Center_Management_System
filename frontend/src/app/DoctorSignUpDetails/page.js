import React, { useState } from 'react';
import BackNavbar from '../../components/backNavBar'; // Import the Navbar component
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { registerDoctorStep2 } from '../../Services/authService'; // Import the registerDoctor step 2 function
import { useRouter } from 'next/router'; // Import useRouter from next/router

// Component for the Doctor Sign Up Details
const DoctorSignUpDetails = () => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [rePassword, setRePassword] = useState('');
  const router = useRouter(); // Initialize useRouter

  return (
    <div>
      <BackNavbar />{/* Insert the navigation bar */}

      {/* Create the login form */}
      <section className="container d-flex justify-content-center">
        <div className="col-md-6 loginForm">
          <h2 className="text-center mb-4">Create Doctor Account</h2>
          <form
            className="temporyLoginForm"
            onSubmit={async (e) => {
              e.preventDefault();
              const secret_Key = process.env.NEXT_PUBLIC_SECRET_KEY; // Use environment variable for the secret key
              
              // FrontEnd Form Validation
              if (secretKey !== secret_Key) {
                toast.error("Invalid Secret Key");
              } else if (password !== rePassword) {
                toast.error("Passwords do not match");
              } else {
                try {
                  const formData = {
                    email: userName,
                    username: userName,
                    password,
                    secretKey: secret_Key, // Use the environment variable
                  };
                  
                  const response = await registerDoctorStep2(formData);
                  if (response.success) {
                    toast.success("Account Created Successfully");
                    router.push('/DoctorLogin'); // Use router for redirection
                  } else {
                    toast.error(response.message || "Something went wrong.");
                  }
                } catch (error) {
                  toast.error(error.message || "Something went wrong.");
                }
              }
            }}
          >
            <div className="mb-3">
              <label htmlFor="userName" className="form-label">User Name:</label>
              <input
                type="text"
                className="form-control"
                id="userName"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password:</label>
              <input
                type="password"
                className="form-control"
                id="register-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="rePassword" className="form-label">Re Enter Password:</label>
              <input
                type="password"
                className="form-control"
                id="register-re-password"
                value={rePassword}
                onChange={(e) => setRePassword(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="secretKey" className="form-label">Secret Key:</label>
              <input
                type="password"
                className="form-control"
                id="secretKey"
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
                required
              />
            </div>

            <p>Already have an account? &nbsp;
              <a href="/DoctorLogin">Log in</a></p>

            <button type="submit" className="btn btn-primary w-100 loginBtn">
              Create Account
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

export default DoctorSignUpDetails;
