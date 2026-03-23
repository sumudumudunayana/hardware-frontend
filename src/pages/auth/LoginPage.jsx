import React, { useState } from "react";
import axios from "axios";
import "../../css/auth/LoginPageStyles.css";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5500/api/auth/login",
        formData,
      );
      localStorage.setItem("token", res.data.token);
      navigate("/LandingPage");
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="login-bg-grid"></div>
      <div className="bg-glow bg-glow-1"></div>
      <div className="bg-glow bg-glow-2"></div>
      <div className="login-card">
        <div className="login-badge">SECURE ACCESS</div>

        <h1>Welcome Back</h1>
        <p className="login-subtitle">
          Sign in to access your hardware management control center.
        </p>

        <form onSubmit={handleLogin}>
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
              placeholder="Enter your password"
              onChange={handleChange}
              required
            />
          </div>
          <div className="login-options">
            <label>
              <input type="checkbox" /> Remember me
            </label>

            <span className="forgot">Forgot password?</span>
          </div>

          <button className="login-btn" type="submit">
            Login
          </button>
        </form>

        <p className="register-link">
          Don't have an account?
          <span onClick={() => navigate("/RegisterPage")}> Register</span>
        </p>
      </div>
    </div>
  );
}
