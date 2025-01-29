import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import "./App.css";
import "./index.css"; // Tailwind 

function CustomerPage() {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [cart, setCart] = useState({});
  const [selectedBook, setSelectedBook] = useState(null);
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

  const fetchBooks = async () => {
    try {
      const response = await fetch("http://localhost:5000/books");
      const data = await response.json();
      setBooks(data);

      const uniqueCategories = [...new Set(data.map((book) => book.category))].filter(
        (category) => category
      );
      setCategories(uniqueCategories);
    } catch (err) {
      console.error(err);
    }
  };

  const updateCart = (bookId, increment) => {
    setCart((prevCart) => {
      const currentQuantity = prevCart[bookId] || 0;
      const newQuantity = currentQuantity + increment;

      if (newQuantity < 0 || newQuantity > 5) return prevCart;

      return {
        ...prevCart,
        [bookId]: newQuantity,
      };
    });
  };

  const handleCheckout = () => {
    const booksToBuy = Object.entries(cart).filter(([_, qty]) => qty > 0);
    if (!booksToBuy.length) {
      setModalTitle("Cart Empty");
      setModalContent("Your cart is empty. Please add items to proceed.");
      setShowModal(true);
      setConfirmCallback(null);
      return;
    }

    const totalCost = booksToBuy.reduce((sum, [id, qty]) => {
      const book = books.find((b) => b._id === id);
      return sum + book.price * qty;
    }, 0);

    setModalTitle("Purchase Confirmation");
    setModalContent(`Your total is €${totalCost.toFixed(2)}. Confirm your purchase?`);
    setShowModal(true);
    setConfirmCallback(() => () => processPurchase(booksToBuy)); 
  };

  const processPurchase = async (booksToBuy) => {
    for (const [bookId, quantity] of booksToBuy) {
      const book = books.find((b) => b._id === bookId);
      if (book.stock < quantity) {
        setModalTitle("Stock Error");
        setModalContent(`Not enough stock for ${book.title}.`);
        setShowModal(true);
        setConfirmCallback(null);
        continue;
      }

      try {
        await fetch(`http://localhost:5000/books/${bookId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...book, stock: book.stock - quantity }),
        });
        fetchBooks();
        setCart({});
      } catch (err) {
        console.error(err);
      }
    }
    setModalTitle("Purchase Successful");
    setModalContent("Please go to the front desk to retrieve your books.");
    setShowModal(true);
    setConfirmCallback(null);
  };

  const filteredBooks = books.filter(
    (book) =>
      (book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedCategory ? book.category === selectedCategory : true)
  );

  const handleViewBook = (bookId) => {
    const book = books.find((b) => b._id === bookId);
    setSelectedBook(book);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div className="app-container min-h-screen bg-gray-100 dark:bg-gray-900 dark:text-gray-100">
      <Navbar />
      <div className="absolute right-8 top-4 flex items-center gap-4">
        <Button
          onClick={handleCheckout}
          variant="success"
          className="d-flex align-items-center"
        >
          <FontAwesomeIcon icon={faShoppingCart} className="mr-2" /> Confirm Purchase
        </Button>
        <button
          onClick={toggleDarkMode}
          className="bg-blue-600 text-white py-2 px-4 rounded-md shadow-lg hover:bg-blue-700 transition"
        >
          {isDarkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </div>
      <main className="max-w-6xl mx-auto py-8 px-4">
        <h2 className="text-4xl font-bold text-center mb-8">Customer Page</h2>
        <div className="flex flex-wrap gap-4 justify-center mb-10">
          <input
            type="text"
            placeholder="Search by Title or Author ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-3 border rounded-md shadow-md focus:ring-2 focus:ring-blue-500 w-full max-w-md dark:bg-gray-800 dark:border-gray-700 dark:focus:ring-gray-400"
          />
          <select
            className="p-3 border rounded-md shadow-md focus:ring-2 focus:ring-blue-500 w-full max-w-md dark:bg-gray-800 dark:border-gray-700 dark:focus:ring-gray-400"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        {selectedBook ? (
          <div className="selected-book bg-white rounded-lg shadow-lg p-6 mb-10 flex dark:bg-gray-800">
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-blue-700 mb-4 dark:text-blue-400">{selectedBook.title}</h3>
              <p><strong>Author:</strong> {selectedBook.author}</p>
              <p><strong>Category:</strong> {selectedBook.category}</p>
              <p><strong>ISBN:</strong> {selectedBook.isbn || "N/A"}</p>
              <p><strong>Price:</strong> €{selectedBook.price?.toFixed(2)}</p>
              <p><strong>Stock:</strong> {selectedBook.stock}</p>
              <button
                onClick={() => setSelectedBook(null)}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Back to List
              </button>
            </div>
            <div className="flex-1">
              <img
                src={selectedBook.image || "https://via.placeholder.com/400x600"}
                alt={selectedBook.title}
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBooks.map((book) => (
              <div
                key={book._id}
                className="book-card bg-white rounded-lg shadow-lg transition transform hover:scale-105 hover:shadow-2xl border-t-4 border-blue-600 dark:bg-gray-800"
              >
                <img
                  src={book.image || "https://via.placeholder.com/400x600"}
                  alt={book.title}
                  className="rounded-t-lg"
                />
                <div className="book-card-content p-4">
                  <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-400">{book.title}</h3>
                  <p className="text-gray-600 dark:text-gray-200">Author: {book.author}</p>
                  <p className="text-gray-600 dark:text-gray-200">Category: {book.category || "N/A"}</p>
                  <p className="text-gray-600 dark:text-gray-200">
                    Price: {book.price != null ? `€${book.price.toFixed(2)}` : "N/A"}
                  </p>
                  <p className="text-gray-600 dark:text-gray-200">Stock: {book.stock}</p>
                  <button
                    onClick={() => handleViewBook(book._id)}
                    className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    View Details
                  </button>
                  <div className="flex items-center space-x-4 mt-4">
                    <button
                      onClick={() => updateCart(book._id, -1)}
                      className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition"
                    >
                      -
                    </button>
                    <span className="text-lg font-bold text-gray-800 dark:text-gray-200">
                      {cart[book._id] || 0}
                    </span>
                    <button
                      onClick={() => updateCart(book._id, 1)}
                      className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalContent}</Modal.Body>
        <Modal.Footer>
          {confirmCallback ? (
            <Button variant="success" onClick={() => confirmCallback()}>
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

export default CustomerPage;
