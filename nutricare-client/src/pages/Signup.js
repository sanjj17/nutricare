import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // ✅ this is fine

const Signup = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); // ✅ moved inside component

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8080/api/signup", formData);
      alert("🎉 Signup successful!");
      localStorage.setItem("token", res.data.token);
      login(res.data.user); // ✅ optional: update auth context
    navigate("/profile/create"); // or a separate route for new profiles

    } catch (err) {
      console.error("Signup error:", err);
      if (err.response?.data?.message === "Email already registered") {
        alert("❗ Account already exists with this email.");
      } else {
        alert("❌ Signup failed");
      }
    }
  };

  return (
    <div className="min-h-screen bg-purple-100 flex items-center justify-center">
      <form
        onSubmit={handleSignup}
        className="bg-white p-8 rounded shadow-md w-full max-w-sm space-y-4"
      >
        <h2 className="text-2xl font-bold text-center text-purple-700">
          Sign Up
        </h2>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
        >
          Create Account
        </button>
      </form>
    </div>
  );
};

export default Signup;
