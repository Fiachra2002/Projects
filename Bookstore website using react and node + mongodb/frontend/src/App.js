import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CustomerPage from "./CustomerPage";
import AdminLogin from "./AdminLogin";
import AdminPage from "./AdminPage";

function App() {
  return (
    <Router>
      <Routes>
        {/* Customer Page */}
        <Route path="/" element={<CustomerPage />} />

        {/* Admin Login Page */}
        <Route path="/admin-login" element={<AdminLogin />} />

        {/* Admin Dashboard Page */}
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </Router>
  );
}

export default App;
