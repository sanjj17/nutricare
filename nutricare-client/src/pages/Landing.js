import React from "react";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-100 to-blue-200 text-center px-4">
      <h1 className="text-5xl font-extrabold text-blue-800 mb-4">NutriCare</h1>
      <p className="text-lg text-gray-700 mb-8">
        Empowering families with personalized nutrition & health planning 💪
      </p>

      <div className="flex space-x-4">
        <button
          onClick={() => navigate("/signup")}
          className="px-6 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition"
        >
          Sign Up
        </button>
        <button
          onClick={() => navigate("/login")}
          className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
        >
          Log In
        </button>
      </div>
    </div>
  );
};

export default Landing;