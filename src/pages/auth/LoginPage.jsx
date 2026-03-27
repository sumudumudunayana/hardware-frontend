import React, { useState } from "react";
import axios from "axios";
import "../../css/auth/LoginPageStyles.css";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

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

  // LOGIN WITH VALIDATION + SONNER
  const handleLogin = async (e) => {
  e.preventDefault();

  const { email, password } = formData;

  const errors = [];

  if (!email || !email.trim()) {
    errors.push("Email is required");
  } else if (!/^\S+@\S+\.\S+$/.test(email)) {
    errors.push("Invalid email format");
  }

  if (!password || !password.trim()) {
    errors.push("Password is required");
  }

  if (errors.length > 0) {
    errors.forEach((err) => toast.error(err));
    return;
  }

  try {
    const res = await axios.post(
      "http://localhost:5500/api/auth/login",
      {
        email: email.trim(),
        password: password.trim(),
      }
    );

    // ✅ SUCCESS ONLY HERE
    toast.success("Login successful!");

    localStorage.setItem("token", res.data.token);

    setTimeout(() => {
      navigate("/LandingPage");
    }, 500);

  } catch (error) {
    // ✅ ERROR ONLY HERE
    toast.error(
      error.response?.data?.message || "Invalid credentials"
    );
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
              type="text"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="input-box">
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
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
          <span onClick={() => navigate("/RegisterPage")}>
            {" "}
            Register
          </span>
        </p>
      </div>
    </div>
  );
}