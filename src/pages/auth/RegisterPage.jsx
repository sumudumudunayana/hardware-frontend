import React, { useState } from "react";
import axios from "axios";
import "../../css/auth/RegisterPageStyles.css";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

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

  // ✅ REGISTER WITH VALIDATION + SONNER
  const handleRegister = async (e) => {
    e.preventDefault();

    const { name, email, password } = formData;

    const errors = [];

    // validations
    if (!name || !name.trim()) {
      errors.push("Name is required");
    } else if (name.trim().length < 2) {
      errors.push("Name must be at least 2 characters");
    }

    if (!email || !email.trim()) {
      errors.push("Email is required");
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      errors.push("Invalid email format");
    }

    if (!password || !password.trim()) {
      errors.push("Password is required");
    } else if (password.length < 4) {
      errors.push("Password must be at least 4 characters");
    }

    // show multiple errors
    if (errors.length > 0) {
      errors.forEach((err) => toast.error(err));
      return;
    }

    try {
      await toast.promise(
        axios.post("http://localhost:5500/api/auth/register", {
          name: name.trim(),
          email: email.trim(),
          password: password.trim(),
        }),
        {
          loading: "Creating account...",
          success: "Registration successful!",
          error: "Registration failed",
        }
      );

      // redirect after success
      setTimeout(() => {
        navigate("/");
      }, 500);

    } catch (error) {
      toast.error(
        error.response?.data?.message || "Registration failed"
      );
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
              value={formData.name}
              onChange={handleChange}
            />
          </div>

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
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
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