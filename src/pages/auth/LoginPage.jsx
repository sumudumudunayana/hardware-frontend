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
      <div className="login-card">
        <h1>Login</h1>

        <form onSubmit={handleLogin}>
          <div className="input-box">
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-box">
            <input
              type="password"
              name="password"
              placeholder="Password"
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

          <button className="login-btn">Login</button>
        </form>

        <p className="register-link">
          Don't have an account?
          <span onClick={() => navigate("/RegisterPage")}>Register</span>
        </p>
      </div>
    </div>
  );
}
