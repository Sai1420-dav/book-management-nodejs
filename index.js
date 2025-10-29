const express = require("express");
const path = require("path");
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname))); // Serve HTML file

let books = [];

// Get all books
app.get("/books", (req, res) => {
  res.json(books);
});

// Add a new book
app.post("/books", (req, res) => {
  const { title, author, year } = req.body;
  if (!title || !author || !year) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const newBook = { id: books.length + 1, title, author, year };
  books.push(newBook);
  res.json({ message: "Book added successfully", books });
});

// Delete a book
app.delete("/books/:id", (req, res) => {
  const id = parseInt(req.params.id);
  books = books.filter((book) => book.id !== id);
  res.json({ message: "Book deleted successfully", books });
});

app.listen(PORT, () => {
  console.log(`📚 Server running at http://localhost:${PORT}`);
});
