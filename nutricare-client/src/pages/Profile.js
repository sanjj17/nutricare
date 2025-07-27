import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { generatePDFReport } from "./pdfGenerator";
import foodData from "../FoodData.js"; // Correct path

const Profile = () => {
  const userEmail = localStorage.getItem("userEmail");
  const [userData, setUserData] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [weeklyPlan, setWeeklyPlan] = useState([]);
  const [showTips, setShowTips] = useState(false);

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

    const goals = Array.isArray(user.goals)
      ? user.goals
      : typeof user.goals === "string"
      ? [user.goals]
      : [];

    if (goals.includes("lose_weight")) {
      tips.push("Eat more home-cooked meals with controlled portions");
      tips.push("Add low-calorie high-volume foods: cucumber, soup, fruits");
      tips.push("Stay hydrated and walk at least 30 mins daily");
    }
    if (goals.includes("gain_weight")) {
      tips.push("Include calorie-dense snacks like dry fruits, peanut butter");
      tips.push("Add healthy fats: ghee, cheese, nuts in meals");
    }
    if (goals.includes("stay healthy")) {
      tips.push("Ensure balanced diet: 50% veggies, 25% protein, 25% carbs");
      tips.push("Get regular blood tests and maintain sleep cycle");
    }

    return tips;
  };

  const generateWeeklyMealPlan = (userGoals, userConditions) => {
    const allPreferences = [...userGoals, ...userConditions];

    const filteredFood = foodData.filter(item =>
      item.suitableFor.some(condition => allPreferences.includes(condition))
    );

    const getMealByType = (mealType, usedItems) => {
      const options = filteredFood.filter(
        item => item.meal === mealType && !usedItems.includes(item.name)
      );
      if (options.length === 0) return null;

      const chosen = options[Math.floor(Math.random() * options.length)];
      usedItems.push(chosen.name);
      return chosen.name;
    };

    const weeklyPlan = [];
    let usedBreakfast = [];
    let usedLunch = [];
    let usedDinner = [];
    let usedSnack = [];

    for (let i = 0; i < 7; i++) {
      const breakfast = getMealByType("breakfast", usedBreakfast) || "Any healthy breakfast";
      const lunch = getMealByType("lunch", usedLunch) || "Any balanced lunch";
      const dinner = getMealByType("dinner", usedDinner) || "Any light dinner";
      const snack = getMealByType("snack", usedSnack) || "Fruit / Nuts";

      weeklyPlan.push({
        day: `Day ${i + 1}`,
        breakfast,
        lunch,
        dinner,
        snack,
      });
    }

    return weeklyPlan;
  };

  useEffect(() => {
    if (!userEmail) {
      alert("You're not logged in. Redirecting...");
      navigate("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/users/${userEmail}`);
        setUserData(res.data);
      } catch (err) {
        console.error("❌ Failed to fetch user profile:", err);
        alert("Could not load your profile. Please complete it first.");
      }
    };

    fetchProfile();
  }, [userEmail, navigate]);

  useEffect(() => {
    if (userData) {
      const tips = getSuggestions(userData);
      setSuggestions(tips);

      const goals = Array.isArray(userData.goals)
        ? userData.goals
        : typeof userData.goals === "string"
        ? [userData.goals]
        : [];

      const conditions = [];
      if (userData.diabetes) conditions.push("diabetes");
      if (userData.bp) conditions.push("bp");
      if (userData.cholesterol) conditions.push("cholesterol");

      const plan = generateWeeklyMealPlan(goals, conditions);
      setWeeklyPlan(plan);
    }
  }, [userData]);

  const handleGenerateReport = () => {
    if (!userData || !weeklyPlan.length) return;
    generatePDFReport(userData, weeklyPlan);
  };

  const formattedGoals = Array.isArray(userData?.goals)
    ? userData.goals.join(", ")
    : typeof userData?.goals === "string"
    ? userData.goals
    : "No goals set";

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex flex-col items-center justify-center px-4">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-purple-700 mb-6 text-center">
          NutriCare Dashboard
        </h2>

        {userData && (
          <>
            <h2 className="text-2xl font-bold text-purple-800 text-center mb-2">
              Welcome back, {userData.name}! 🎉
            </h2>
            <p className="text-center text-gray-600 mb-6">
              Here's your personalized NutriCare dashboard.
            </p>

            <div className="grid grid-cols-2 gap-4 text-center mb-6">
              <div className="bg-green-100 p-4 rounded-xl">
                <h4 className="font-semibold text-green-800">Age</h4>
                <p>{userData.age}</p>
              </div>
              <div className="bg-blue-100 p-4 rounded-xl">
                <h4 className="font-semibold text-blue-800">Weight</h4>
                <p>{userData.weight} kg</p>
              </div>
              <div className="bg-yellow-100 p-4 rounded-xl">
                <h4 className="font-semibold text-yellow-800">Goals</h4>
                <p>{formattedGoals}</p>
              </div>
              <div className="bg-pink-100 p-4 rounded-xl">
                <h4 className="font-semibold text-pink-800">Conditions</h4>
                <p>
                  {[
                    userData.diabetes && "Diabetes",
                    userData.bp && "BP",
                    userData.cholesterol && "Cholesterol"
                  ]
                    .filter(Boolean)
                    .join(", ") || "None"}
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowTips(!showTips)}
              className="bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-800 mt-4"
            >
              {showTips ? "Hide Health Suggestions" : "Show Health Suggestions"}
            </button>

            {showTips && (
              <div className="mt-6 p-4 border-2 border-purple-300 rounded-lg bg-purple-50 shadow">
                <h3 className="font-bold text-purple-800 mb-2">Health Suggestions 🩺</h3>
                {suggestions.length > 0 ? (
                  <ul className="list-disc pl-5 text-purple-700 space-y-1">
                    {suggestions.map((tip, i) => (
                      <li key={i}>{tip}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-purple-600 italic">
                    No suggestions found. Try updating your goals or health info!
                  </p>
                )}
              </div>
            )}

            <div className="mt-6 flex justify-center gap-4">
              <button
                onClick={() => navigate("/home")}
                className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
              >
                Update Details
              </button>
              <button
                onClick={handleGenerateReport}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Generate Health Report
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
