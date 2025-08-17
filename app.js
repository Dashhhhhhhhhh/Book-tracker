const pool = require('./db');
const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

// Test DB connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Connected to DB at:', res.rows[0].now);
  }
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Render homepage
app.get('/', (req, res) => {
  res.render('index');
});

// Get all books
app.get('/books', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM books');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching books:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Add a new book
app.post('/add-book', async (req, res) => {
  try {
    const { title, author } = req.body;
    const trimmedTitle = title?.trim();
    const trimmedAuthor = author?.trim();

    if (!trimmedTitle || !trimmedAuthor) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check for duplicates
    const duplicateCheck = await pool.query(
      'SELECT * FROM books WHERE title = $1 AND author = $2',
      [trimmedTitle, trimmedAuthor]
    );
    if (duplicateCheck.rows.length > 0) {
      return res.status(400).json({ error: 'Book already exists' });
    }

    // Insert new book
    const result = await pool.query(
      'INSERT INTO books (title, author) VALUES ($1, $2) RETURNING *',
      [trimmedTitle, trimmedAuthor]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error adding book:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update a book
app.patch('/edit-book/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author } = req.body;

    const result = await pool.query(
      'UPDATE books SET title = $1, author = $2 WHERE id = $3 RETURNING *',
      [title, author, id]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Book not found' });
    }

    res.json({ message: 'Book updated successfully', updatedBook: result.rows[0] });
  } catch (err) {
    console.error('Error updating book:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Delete a book
app.delete('/remove-book/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM books WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Book not found' });
    }

    res.json({ message: 'Book deleted successfully', deletedBook: result.rows[0] });
  } catch (err) {
    console.error('Error deleting book:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Express app listening on port ${port}!`);
});
