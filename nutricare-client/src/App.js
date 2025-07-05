import React from "react";


import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Result from "./Result";
import Users from "./Users";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/users" element={<Users />} />

        <Route path="/" element={<Home />} />
        <Route path="/result" element={<Result />} />
      </Routes>
    </Router>
  );
}

export default App;
