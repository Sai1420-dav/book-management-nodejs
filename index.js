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

// 🔥 Home Route (version + timestamp)
app.get("/", (req, res) => {
  res.send(`
    <h1>🚀 Book App is LIVE</h1>
    <h3>Version: 2.1</h3>
    <p>Last Updated: ${new Date().toLocaleString()}</p>
  `);
});

// 🔥 Health check route (IMPORTANT for CI/CD)
app.get("/status", (req, res) => {
  res.json({
    status: "OK ✅",
    message: "Deployment working perfectly",
    time: new Date().toISOString(),
    version: "2.1"
  });
});

// 📚 Get all books
app.get("/books", (req, res) => {
  res.json({
    count: books.length,
    books,
  });
});

// ➕ Add book
app.post("/books", (req, res) => {
  const { title, author, year } = req.body;

  if (!title || !author || !year) {
    return res.status(400).json({
      error: "title, author, year required",
    });
  }

  const newBook = {
    id: currentId++,
    title,
    author,
    year,
  };

  books.push(newBook);

  console.log("📘 Added:", newBook);

  res.status(201).json({
    message: "Book added",
    book: newBook,
  });
});

// ❌ Delete book
app.delete("/books/:id", (req, res) => {
  const id = Number(req.params.id);

  const exists = books.find(b => b.id === id);

  if (!exists) {
    return res.status(404).json({
      error: "Book not found",
    });
  }

  books = books.filter(b => b.id !== id);

  console.log("🗑️ Deleted:", id);

  res.json({
    message: "Book deleted",
    books,
  });
});

// 🔥 Server start
app.listen(PORT, "0.0.0.0", () => {
  console.log(`📚 Server running on port ${PORT}`);
  console.log(`🚀 App started at ${new Date().toLocaleString()}`);
});
