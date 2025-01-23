import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Statistics from "./pages/Statistics/Statistics";
import Calendar from "./pages/Calendar";


const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/statistics" element={<Statistics />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/calendar" element={<Calendar/>} />
        
      </Routes>
    </Router>
  );
};

export default App;
