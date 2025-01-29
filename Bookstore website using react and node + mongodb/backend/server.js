const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bookData = require('./data/books.json');

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/BookStoreDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'));

// Book Schema
const bookSchema = new mongoose.Schema({
  title: String,
  isbn: String,
  author: String,
  category: String,
  price: Number,
  stock: Number,
  image: String,
});


const BookModel = mongoose.models.Book || mongoose.model('Book', bookSchema);

// Run localhost:5000/seed to insert json data 
app.get('/seed', async (req, res) => {
  try {
    await BookModel.deleteMany({});
    await BookModel.insertMany(bookData);
    res.send('Books reseeded successfully.');
  } catch (err) {
    res.status(500).json({ message: 'Error reseeding books', error: err.message });
  }
});

// GET all books
app.get('/books', async (req, res) => {
  try {
    const books = await BookModel.find();
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching books', error: err.message });
  }
});

// POST a new book
app.post('/books', async (req, res) => {
  try {
    const book = new BookModel(req.body);
    await book.save();
    res.json(book);
  } catch (err) {
    res.status(400).json({ message: 'Error adding book', error: err.message });
  }
});

// DELETE a book
app.delete('/books/:id', async (req, res) => {
  try {
    await BookModel.findByIdAndDelete(req.params.id);
    res.json({ message: 'Book deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting book', error: err.message });
  }
});

// PUT - Update a book
app.put('/books/:id', async (req, res) => {
  try {
    const updatedBook = await BookModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedBook);
  } catch (err) {
    res.status(500).json({ message: 'Error updating book', error: err.message });
  }
});

// Start Server
app.listen(5000, () => {
  console.log('Server running on port 5000');
});
