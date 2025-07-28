import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Result from "./pages/Result";
import Users from "./Users";
import Profile from "./pages/Profile";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Landing from "./pages/Landing";
import CreateProfile from './pages/CreateProfile'; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} /> {/* ✅ Show Landing first */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/users" element={<Users />} />
        <Route path="/home" element={<Home />} />
        <Route path="/result" element={<Result />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/create" element={<CreateProfile />} />
        {/* Example ProtectedRoute usage if needed:
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} /> 
        */}
      </Routes>
    </Router>
  );
}

export default App;
