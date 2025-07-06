import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [name, setName] = useState("");
  const [userData, setUserData] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  const getSuggestions = (user) => {
    const tips = [];
    if (user.diabetes) {
      tips.push("Avoid sugar, white rice, and potatoes");
      tips.push("Include more fiber-rich foods like oats, methi, and whole grains");
    }
    if (user.bp) {
      tips.push("Reduce salt and processed foods");
      tips.push("Eat potassium-rich foods like bananas and spinach");
    }
    if (user.cholesterol) {
      tips.push("Avoid fried food and saturated fats");
      tips.push("Include more flax seeds, walnuts, and oats");
    }
    if (user.weight < 45) {
      tips.push("Include more protein: dal, paneer, eggs, milk");
    }
    if (user.age > 50) {
      tips.push("Ensure enough calcium: curd, milk, ragi, sesame seeds");
    }
    return tips;
  };

  const handleSearch = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/users");
      const allUsers = res.data;

      const user = allUsers.find(
        (u) => u.name.toLowerCase() === name.toLowerCase()
      );

      if (user) {
        setUserData(user);
        const tips = getSuggestions(user);
        setSuggestions(tips);
      } else {
        alert("No user found. Redirecting to form...");
        navigate("/");
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      alert("Failed to fetch users.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex flex-col items-center justify-center px-4">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-purple-700 mb-6 text-center">
          Find Your NutriCare Profile
        </h2>
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />
        <button
          onClick={handleSearch}
          className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
        >
          Search Profile
        </button>

        {userData && (
          <div className="mt-6 p-4 border rounded-lg bg-purple-50">
            <h3 className="font-bold text-purple-800 text-lg mb-2">Profile:</h3>
            <p><strong>Name:</strong> {userData.name}</p>
            <p><strong>Age:</strong> {userData.age}</p>
            <p><strong>Weight:</strong> {userData.weight}</p>
            <p><strong>Gender:</strong> {userData.gender}</p>
            <p><strong>Goals:</strong> {userData.goals?.map(g => g.replace("_", " ")).join(", ") || "None"}</p>

            <p><strong>Conditions:</strong> {[
              userData.diabetes && "Diabetes",
              userData.bp && "Blood Pressure",
              userData.cholesterol && "Cholesterol"
            ].filter(Boolean).join(", ") || "None"}</p>

            <h3 className="mt-4 font-bold text-purple-800">Suggestions:</h3>
            <ul className="list-disc pl-5 text-purple-700">
              {suggestions.map((tip, i) => (
                <li key={i}>{tip}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
