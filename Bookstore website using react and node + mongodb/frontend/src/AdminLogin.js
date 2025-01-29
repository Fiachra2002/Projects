import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import "./App.css";
import "./index.css"; 

function AdminLogin() {
  const [code, setCode] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();

  const handleLogin = () => {
    const ADMIN_CODE = "12345678";
    if (code === ADMIN_CODE) {
      navigate("/admin");
    } else {
      setShowModal(true);
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div className="app-container min-h-screen bg-gray-100 dark:bg-gray-900 dark:text-gray-100">
      <Navbar />
      <main className="max-w-6xl mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-4xl font-bold text-center">Admin Login</h2>
          <button
            onClick={toggleDarkMode}
            className="bg-blue-600 text-white py-2 px-4 rounded-md shadow-lg hover:bg-blue-700 transition"
          >
            {isDarkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>
        <div className="flex justify-center">
          <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-sm dark:bg-gray-800">
            <input
              type="password"
              placeholder="Enter 8-digit admin code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-400 mb-4 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-gray-500"
            />
            <button
              onClick={handleLogin}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
            >
              Login
            </button>
          </div>
        </div>
      </main>
      <Footer />

      {/* Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Invalid Code</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          The admin code you entered is incorrect. Please try again.
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            onClick={() => setShowModal(false)}
            className="w-full"
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default AdminLogin;
