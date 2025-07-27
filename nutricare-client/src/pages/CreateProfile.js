import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateProfile = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    age: "",
    weight: "",
    gender: "",
    conditions: {
      diabetes: false,
      bp: false,
      cholesterol: false,
    },
    goals: [],
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleConditionChange = (e) => {
    const { name, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      conditions: { ...prev.conditions, [name]: checked },
    }));
  };

  const handleGoalsChange = (e) => {
    const value = e.target.value;
    setForm((prev) => ({
      ...prev,
      goals: prev.goals.includes(value)
        ? prev.goals.filter((g) => g !== value)
        : [...prev.goals, value],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = localStorage.getItem("userName"); // in case you stored it on signup
    const email = localStorage.getItem("userEmail"); // definitely set during login/signup
    if (!email) return alert("❗ User email not found. Please login again.");

    try {
      await axios.post("http://localhost:8080/api/users", {
        name,
        email,
        ...form,
      });
      alert("🎉 Profile created!");
      navigate("/profile");
    } catch (err) {
      console.error("❌ Profile creation failed", err);
      alert("Failed to create profile");
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 flex justify-center items-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-full max-w-md space-y-4"
      >
        <h2 className="text-xl font-bold text-center text-blue-700">Complete Your Profile</h2>

        <input
          type="number"
          name="age"
          placeholder="Age"
          value={form.age}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          name="weight"
          placeholder="Weight (kg)"
          value={form.weight}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <select
          name="gender"
          value={form.gender}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        >
          <option value="">Select Gender</option>
          <option value="female">Female</option>
          <option value="male">Male</option>
          <option value="other">Other</option>
        </select>

        <div className="space-y-1">
          <label className="block font-medium text-gray-700">Health Conditions:</label>
          {["diabetes", "bp", "cholesterol"].map((c) => (
            <label key={c} className="block text-sm">
              <input
                type="checkbox"
                name={c}
                checked={form.conditions[c]}
                onChange={handleConditionChange}
              />{" "}
              {c[0].toUpperCase() + c.slice(1)}
            </label>
          ))}
        </div>

        <div>
          <label className="block font-medium text-gray-700">Your Goals:</label>
          {["weight_loss", "muscle_gain", "healthy_lifestyle"].map((g) => (
            <label key={g} className="block text-sm">
              <input
                type="checkbox"
                value={g}
                checked={form.goals.includes(g)}
                onChange={handleGoalsChange}
              />{" "}
              {g.replace("_", " ")}
            </label>
          ))}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Save Profile
        </button>
      </form>
    </div>
  );
};

export default CreateProfile;
