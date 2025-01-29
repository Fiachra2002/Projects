import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEdit, faTrash, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import Footer from "./components/Footer";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import "./App.css";
import "./index.css"; // Tailwind

function AdminPage() {
  const [books, setBooks] = useState([]);
  const [newBook, setNewBook] = useState({
    title: "",
    isbn: "",
    author: "",
    category: "",
    price: "",
    stock: "",
    image: "",
  });
  const [editingBook, setEditingBook] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [confirmCallback, setConfirmCallback] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    fetchBooks();
    
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  const fetchBooks = () => {
    fetch("http://localhost:5000/books")
      .then((res) => res.json())
      .then((data) => setBooks(data))
      .catch((err) => console.error(err));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editingBook) {
      setEditingBook({ ...editingBook, [name]: value });
    } else {
      setNewBook({ ...newBook, [name]: value });
    }
  };

  const addOrEditBook = () => {
    const action = editingBook ? "edit" : "add";
    const book = editingBook || newBook;
    const url = editingBook
      ? `http://localhost:5000/books/${editingBook._id}`
      : "http://localhost:5000/books";

    fetch(url, {
      method: editingBook ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(book),
    })
      .then((res) => res.json())
      .then(() => {
        fetchBooks();
        setEditingBook(null);
        setNewBook({
          title: "",
          isbn: "",
          author: "",
          category: "",
          price: "",
          stock: "",
          image: "",
        });
        setModalTitle(action === "edit" ? "Book Updated" : "Book Added");
        setModalContent(
          `The book was successfully ${action === "edit" ? "updated" : "added"}!`
        );
        setShowModal(true);
      })
      .catch((err) => console.error(err));
  };

  const deleteBook = (id) => {
    setModalTitle("Delete Book");
    setModalContent("Are you sure you want to delete this book?");
    setConfirmCallback(() => () => {
      fetch(`http://localhost:5000/books/${id}`, { method: "DELETE" })
        .then(() => fetchBooks())
        .catch((err) => console.error(err));
      setShowModal(false);
    });
    setShowModal(true);
  };

  const handleEdit = (book) => {
    setEditingBook(book);
  };

  const handleLogout = () => {
    window.location.href = "/admin-login";
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div className="app-container min-h-screen bg-gray-100 dark:bg-gray-900 dark:text-gray-100">
      {/* Navbar */}
      <nav className="navbar bg-blue-600 text-white py-4 shadow-lg dark:bg-gray-800 dark:text-gray-200">
        <div className="max-w-6xl mx-auto flex justify-between items-center px-4">
          <img
            src={`${process.env.PUBLIC_URL}/logo.png`}
            alt="Bookstore Logo"
            className="h-20 w-20 mr-3"
          />
          <h1 className="text-2xl font-bold tracking-wide">Bookstore Management</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700 transition flex items-center"
          >
            <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" /> Logout
          </button>
        </div>
      </nav>

      <div className="absolute right-8 top-4">
        <button
          onClick={toggleDarkMode}
          className="bg-blue-600 text-white py-2 px-4 rounded-md shadow-lg hover:bg-blue-700 transition"
        >
          {isDarkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </div>

     
      <main className="max-w-6xl mx-auto py-8 px-4">
        <h2 className="text-4xl font-bold text-center text-gray-800 dark:text-gray-100 mb-8">
          Admin Dashboard
        </h2>
        <div className="bg-white shadow-lg rounded-lg p-8 mb-8 dark:bg-gray-800 dark:text-gray-200">
          <h3 className="text-lg font-semibold mb-4">
            {editingBook ? "Edit Book" : "Add a New Book"}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {["title", "isbn", "author", "category", "price", "stock", "image"].map(
              (field) => (
                <input
                  key={field}
                  type={field === "price" || field === "stock" ? "number" : "text"}
                  name={field}
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  value={editingBook ? editingBook[field] : newBook[field]}
                  onChange={handleInputChange}
                  className="p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-gray-500"
                />
              )
            )}
          </div>
          <button
            onClick={addOrEditBook}
            className="bg-blue-600 text-white py-2 px-4 mt-4 rounded hover:bg-blue-700 transition flex items-center"
          >
            <FontAwesomeIcon icon={editingBook ? faEdit : faPlus} className="mr-2" />
            {editingBook ? "Save Changes" : "Add Book"}
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {books.map((book) => (
            <div
              key={book._id}
              className="bg-white shadow-lg rounded-lg p-4 border-t-4 border-blue-600 dark:bg-gray-800 dark:text-gray-200"
            >
              <img
                src={book.image || "https://via.placeholder.com/400x600"}
                alt={book.title}
                className="rounded-t-lg"
              />
              <h3 className="text-lg font-bold mt-2 dark:text-gray-100">{book.title}</h3>
              <p>ISBN: {book.isbn}</p>
              <p>Author: {book.author}</p>
              <p>Category: {book.category}</p>
              <p>
                Price:{" "}
                {book.price !== null && book.price !== undefined
                  ? `€${book.price.toFixed(2)}`
                  : "N/A"}
              </p>
              <p>Stock: {book.stock}</p>
              <div className="flex justify-between mt-4">
                <button
                  onClick={() => handleEdit(book)}
                  className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600 transition flex items-center"
                >
                  <FontAwesomeIcon icon={faEdit} className="mr-2" /> Edit
                </button>
                <button
                  onClick={() => deleteBook(book._id)}
                  className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700 transition flex items-center"
                >
                  <FontAwesomeIcon icon={faTrash} className="mr-2" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />

      {/* Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalContent}</Modal.Body>
        <Modal.Footer>
          {confirmCallback ? (
            <Button variant="danger" onClick={() => confirmCallback()}>
              Confirm
            </Button>
          ) : null}
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default AdminPage;
