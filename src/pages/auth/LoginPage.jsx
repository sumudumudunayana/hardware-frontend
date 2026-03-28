import React, { useState } from "react";
import api from "../../services/api";
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
      
      const res = await api.post("/auth/login", {
        email: email.trim(),
        password: password.trim(),
      });

      toast.success("Login successful!");

      // store BOTH token + user
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // DEBUG
      console.log("TOKEN:", res.data.token);
      console.log("USER:", res.data.user);

      setTimeout(() => {
        navigate("/LandingPage");
      }, 500);

    } catch (error) {
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