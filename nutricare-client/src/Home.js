import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import foodData from "./FoodData";



const getSuggestions = (formData) => {
  const { conditions, weight, age, goals } = formData;
  const suggestions = [];

  // 🎯 Goal-based suggestions
  if (goals.includes("lose_weight")) {
    suggestions.push("Avoid fried foods and sugary drinks");
    suggestions.push("Eat more salads, sprouts, and portion-controlled meals");
    suggestions.push("Have early dinners and drink more water");
  }

  if (goals.includes("gain_weight")) {
    suggestions.push("Include calorie-dense healthy foods like bananas, nuts, paneer");
    suggestions.push("Eat 5-6 small meals throughout the day");
    suggestions.push("Add ghee, jaggery, and full-fat milk to your diet");
  }

  if (goals.includes("maintain_health")) {
    suggestions.push("Stick to a balanced diet with roti, dal, sabzi, and curd");
    suggestions.push("Avoid excess salt and sugar even if you're healthy");
    suggestions.push("Do light exercise like walking daily");
  }

  if (goals.includes("improve_condition")) {
    suggestions.push("Track blood reports every 3–6 months");
    suggestions.push("Eat foods known to help manage your condition consistently");
    suggestions.push("Cut down on processed/packaged items");
  }

  // 🩺 Condition-based suggestions
  if (conditions.diabetes) {
    suggestions.push("Avoid sugar, white rice, and potatoes");
    suggestions.push("Include oats, barley, and methi seeds");
  }

  if (conditions.bp) {
    suggestions.push("Reduce salt, pickles, and processed foods");
    suggestions.push("Eat potassium-rich foods like bananas, spinach, and oranges");
  }

  if (conditions.cholesterol) {
    suggestions.push("Avoid fried food and saturated fats like butter and cream");
    suggestions.push("Include flax seeds, walnuts, and oats daily");
  }

  // ✅ General context-based
  if (weight < 45) {
    suggestions.push("Eat more dal, paneer, eggs, and milk");
  }

  if (age > 50) {
    suggestions.push("Ensure calcium intake from curd, sesame seeds, ragi");
  }

// 🍲 Add food recommendations from dataset
const allTags = [...goals, ...Object.keys(conditions).filter((c) => conditions[c])];
if (age > 50) allTags.push("age_above_50");

// 🍽 Structured suggestions by meal
const mealSuggestions = {
  breakfast: [],
  lunch: [],
  dinner: []
};

foodData.forEach((item) => {
  if (item.suitableFor.some((tag) => allTags.includes(tag))) {
    const line = `${item.name} – ${item.benefits.join(", ")}`;
    if (mealSuggestions[item.meal]) {
      mealSuggestions[item.meal].push(line);
    }
  }
});

// ✅ Push meal-wise suggestions
for (let meal in mealSuggestions) {
  if (mealSuggestions[meal].length) {
    suggestions.push(`🍽 ${meal.charAt(0).toUpperCase() + meal.slice(1)}:`);
    suggestions.push(...mealSuggestions[meal]);
  }
}

   



  return suggestions;
};

function App() {
   const navigate = useNavigate(); 
  const [nutritionTips, setNutritionTips] = useState([]);
  const [showWeeklyPlan, setShowWeeklyPlan] = useState(false);


 const [formData, setFormData] = useState({
  name: "",
  age: "",
  weight: "",
  gender: "",
  goals: [], // ⬅️ new
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
 const res = await axios.post("http://localhost:8080/api/users", formData);
const suggestions = getSuggestions(formData);
localStorage.setItem("suggestions", JSON.stringify(suggestions)); // save for Result page

console.log("Server response:", res.data.message); // ✅ Debug print

let message = "🎉 New profile created successfully!";
if (res?.data?.message === "User updated") {
  message = "✅ Profile updated successfully!";
}

alert(message);

  navigate("/result");
} catch (error) {
  console.error("Submission error:", error);
  alert("❌ Failed to submit.");
}

};
const generateWeeklyPlan = () => {
  const meals = { breakfast: [], lunch: [], dinner: [] };

  nutritionTips.forEach((tip) => {
    if (tip.startsWith("🍽 Breakfast:")) meals.current = "breakfast";
    else if (tip.startsWith("🍽 Lunch:")) meals.current = "lunch";
    else if (tip.startsWith("🍽 Dinner:")) meals.current = "dinner";
    else if (meals.current) meals[meals.current].push(tip);
  });

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const weekly = [];

  for (let i = 0; i < 7; i++) {
    weekly.push({
      day: days[i],
      breakfast: meals.breakfast[i % meals.breakfast.length] || "-",
      lunch: meals.lunch[i % meals.lunch.length] || "-",
      dinner: meals.dinner[i % meals.dinner.length] || "-",
    });
  }

  return weekly;
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-100 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold text-blue-700 mb-4 text-center">
  NutriCare – User Profile Form
</h2>

<button
  onClick={() => navigate("/profile")}
  className="mb-6 w-full bg-gray-100 text-blue-600 py-2 rounded border border-blue-300 hover:bg-blue-200 transition"
>
  🔍 Already have a profile? View it here
</button>

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
  <label className="block text-gray-700 mb-1">What are your goals?</label>

  {["lose_weight", "gain_weight", "improve_diabetes", "lower_bp", "lower_cholesterol", "maintain_health"].map((goalKey) => (
    <label className="block" key={goalKey}>
      <input
        type="checkbox"
        name="goals"
        value={goalKey}
        checked={formData.goals.includes(goalKey)}
        onChange={(e) => {
          const { value, checked } = e.target;
          setFormData((prev) => ({
            ...prev,
            goals: checked
              ? [...prev.goals, value]
              : prev.goals.filter((g) => g !== value),
          }));
        }}
      />
      <span className="ml-2 capitalize">{goalKey.replace("_", " ")}</span>
    </label>
  ))}
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
          <div className="mt-4">
  <label className="flex items-center gap-2 text-sm text-blue-800">
    <input
      type="checkbox"
      checked={showWeeklyPlan}
      onChange={() => setShowWeeklyPlan(!showWeeklyPlan)}
    />
    Show Weekly Diet Plan
  </label>
</div>

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
{nutritionTips.length > 0 && (
  <button
    onClick={() => setShowWeeklyPlan(!showWeeklyPlan)}
    className="mb-4 w-full bg-yellow-100 text-yellow-800 py-2 rounded border border-yellow-300 hover:bg-yellow-200 transition"
  >
    {showWeeklyPlan ? "Hide Weekly Diet Plan" : "🍽 Show Weekly Diet Plan"}
  </button>
)}

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

{showWeeklyPlan && nutritionTips.length > 0 && (
  <div className="mt-6">
    <h3 className="text-lg font-bold text-blue-800 mb-2">📅 Weekly Diet Plan</h3>
    <table className="w-full text-sm border border-gray-300 text-left bg-white rounded-md overflow-hidden">
      <thead className="bg-blue-100 text-blue-700">
        <tr>
          <th className="p-2">Day</th>
          <th className="p-2">Breakfast</th>
          <th className="p-2">Lunch</th>
          <th className="p-2">Dinner</th>
        </tr>
      </thead>
      <tbody>
        {generateWeeklyPlan().map((day, i) => (
          <tr key={i} className="border-t">
            <td className="p-2 font-semibold">{day.day}</td>
            <td className="p-2">{day.breakfast}</td>
            <td className="p-2">{day.lunch}</td>
            <td className="p-2">{day.dinner}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}


      </div>
    </div>
  );
}

export default App;
