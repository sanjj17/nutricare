import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const getSuggestions = (formData) => {
  const suggestions = [];

  if (formData.conditions.diabetes) {
    suggestions.push("Avoid sugar, white rice, and potatoes");
    suggestions.push("Include more fiber-rich foods like oats, methi, and whole grains");
  }

  if (formData.conditions.bp) {
    suggestions.push("Reduce salt and processed foods");
    suggestions.push("Eat potassium-rich foods like bananas and spinach");
  }

  if (formData.conditions.cholesterol) {
    suggestions.push("Avoid fried food and saturated fats");
    suggestions.push("Include more flax seeds, walnuts, and oats");
  }

  if (formData.weight < 45) {
    suggestions.push("Include more protein: dal, paneer, eggs, milk");
  }

  if (formData.age > 50) {
    suggestions.push("Ensure enough calcium: curd, milk, ragi, sesame seeds");
  }

  return suggestions;
};

function App() {
   const navigate = useNavigate(); 
  const [nutritionTips, setNutritionTips] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    weight: "",
    gender: "",
    conditions: {
      diabetes: false,
      bp: false,
      cholesterol: false,
    },
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name in formData.conditions) {
      setFormData((prev) => ({
        ...prev,
        conditions: {
          ...prev.conditions,
          [name]: checked,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    await axios.post("http://localhost:8080/api/users", formData);
    const suggestions = getSuggestions(formData);
    localStorage.setItem("suggestions", JSON.stringify(suggestions)); // save for Result page
    alert("Form data submitted!");
    navigate("/result");
  } catch (error) {
    console.error("Submission error:", error);
    alert("Failed to submit.");
  }
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-100 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold text-blue-700 mb-6 text-center">
          NutriCare – User Profile Form
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700">Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block text-gray-700">Age:</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block text-gray-700">Weight (kg):</label>
            <input
              type="number"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block text-gray-700">Gender:</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700">Medical Conditions:</label>
            <label className="block">
              <input
                type="checkbox"
                name="diabetes"
                checked={formData.conditions.diabetes}
                onChange={handleChange}
              />
              <span className="ml-2">Diabetes</span>
            </label>
            <label className="block">
              <input
                type="checkbox"
                name="bp"
                checked={formData.conditions.bp}
                onChange={handleChange}
              />
              <span className="ml-2">Blood Pressure</span>
            </label>
            <label className="block">
              <input
                type="checkbox"
                name="cholesterol"
                checked={formData.conditions.cholesterol}
                onChange={handleChange}
              />
              <span className="ml-2">Cholesterol</span>
            </label>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Submit
          </button>
        </form>
        {nutritionTips.length > 0 && (
  <div className="mt-4 p-4 border rounded-lg bg-green-50">
    <h2 className="text-lg font-bold mb-2 text-green-700">Nutrition Suggestions:</h2>
    <ul className="list-disc pl-5 text-green-800">
      {nutritionTips.map((tip, index) => (
        <li key={index}>{tip}</li>
      ))}
    </ul>
  </div>
)}

      </div>
    </div>
  );
}

export default App;
