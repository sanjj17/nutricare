import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [userData, setUserData] = useState(null);


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const res = await axios.post("http://localhost:8080/api/login", form);
    const { token, user } = res.data;

    localStorage.setItem("token", token);
   localStorage.setItem("userEmail", res.data.user.email); // ✅


    alert("✅ Logged in successfully!");
    setUserData(res.data.user);

    
    navigate("/profile");
  } catch (err) {
    alert("❌ Login failed. Please check credentials.");
    console.error(err);
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-100 px-4">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          {userData && (
  <>
    <h2 className="text-2xl font-bold text-purple-800 text-center mb-2">
      Welcome back, {userData.name}! 🎉
    </h2>
    <p className="text-center text-gray-600 mb-6">
      Here's your personalized NutriCare dashboard.
    </p>
  </>
)}

<p className="text-center text-gray-600 mb-6">
  Here's your personalized NutriCare dashboard.
</p>

          <div>
            <label className="block text-gray-700">Email:</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Password:</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
