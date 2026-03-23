import React, { useState } from "react";
import axios from "axios";
import "../../css/auth/RegisterPageStyles.css";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5500/api/auth/register", formData);
      alert("Registration successful");
      navigate("/");
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="register-bg-grid"></div>
      <div className="bg-glow bg-glow-1"></div>
      <div className="bg-glow bg-glow-2"></div>

      <div className="auth-card">
        <div className="register-badge">NEW ACCOUNT</div>

        <h1>Create Account</h1>
        <p className="register-subtitle">
          Create your account to access the hardware management platform.
        </p>

        <form onSubmit={handleRegister}>
          <div className="input-box">
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-box">
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-box">
            <input
              type="password"
              name="password"
              placeholder="Create a password"
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="register-btn">
            Register
          </button>
        </form>

        <p className="auth-link">
          Already have an account?
          <span onClick={() => navigate("/")}> Login</span>
        </p>
      </div>
    </div>
  );
}