const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// In-memory database
let books = [];
let currentId = 1;

// 🔥 Home Route (with version + timestamp)
app.get("/", (req, res) => {
  res.send(`
    <h2>🚀 Book App is LIVE</h2>
    <p>Version: 2.0</p>
    <p>Updated at: ${new Date().toLocaleString()}</p>
  `);
});

// 🔥 Status Route (for testing CI/CD)
app.get("/status", (req, res) => {
  res.json({
    status: "OK ✅",
    message: "Server is running and updated!",
    time: new Date(),
  });
});

// 📚 Get all books
app.get("/books", (req, res) => {
  res.json({
    count: books.length,
    books,
  });
});

// ➕ Add a new book
app.post("/books", (req, res) => {
  const { title, author, year } = req.body;

  if (!title || !author || !year) {
    return res.status(400).json({
      error: "All fields (title, author, year) are required",
    });
  }

  const newBook = {
    id: currentId++,
    title,
    author,
    year,
  };

  books.push(newBook);

  console.log("📘 Book added:", newBook);

  res.status(201).json({
    message: "Book added successfully",
    book: newBook,
  });
});

// ❌ Delete a book
app.delete("/books/:id", (req, res) => {
  const id = parseInt(req.params.id);

  const bookExists = books.find((book) => book.id === id);

  if (!bookExists) {
    return res.status(404).json({
      error: "Book not found",
    });
  }

  books = books.filter((book) => book.id !== id);

  console.log(`🗑️ Book deleted with id: ${id}`);

  res.json({
    message: "Book deleted successfully",
    books,
  });
});

// 🔥 Server Start
app.listen(PORT, "0.0.0.0", () => {
  console.log(`📚 Server running on port ${PORT}`);
  console.log(`🔥 Deployment successful at: ${new Date().toLocaleString()}`);
});
