import React from "react";


import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Result from "./Result";
import Users from "./Users";
import Profile from "./Profile";





function App() {
  return (
    <Router>
      <Routes>
        <Route path="/users" element={<Users />} />

        <Route path="/" element={<Home />} />
        <Route path="/result" element={<Result />} />
        
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;
