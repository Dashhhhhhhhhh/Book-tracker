const pool = require('./db');

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Connected to DB at:', res.rows[0].now);
  }
});

const express = require('express');
const { lstat } = require('fs');
const app = express();
const port = 3000;
const path = require('path');
const crypto = require(`crypto`);

app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded ({ extended: true }));
app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, "views"));

let books = [];

app.get('/', (req, res) => {
    res.render('index', { books });
});



app.post('/add-book', (req, res) => {
    const { title, author } = req.body;

    const trimmedTitle = title.trim();
    const trimmedAuthor = author.trim();


    if ( trimmedTitle === "" || trimmedAuthor === ""){
        return res.status(400).json({ error: "Missing required fields" });
    }

    const duplicate = books.some(book =>
        book.title === trimmedTitle && book.author === trimmedAuthor
    );
    
    if (duplicate) {
    return res.status(400).json({ error: "Book already exists" });
    }

    const id = crypto.randomUUID();

    const newBook = { id, title, author };
    books.push(newBook);

    res.redirect("/"); 
});

app.delete('/remove-book/:id', (req, res) => {
    
    const { id } = req.params;

    const index =  books.findIndex(book => book.id === id);

    if (index === -1) {
        return res.status(400).json({error: 'Book not found'});
    }

    const deleteBook = books.splice(index, 1);

    res.json({ message: 'Book deleted', book: deleteBook[0] });

});

app.patch('/edit-book/:id', (req, res) => {

    const { id } = req.params;
    const updateData = req.body;

    const index =  books.findIndex(book => book.id === id);

    if (index === -1) {
    return res.status(400).json({error: 'Book not found'});
    }

    const updatedBook = { ...books[index], ...updateData };

    books[index] = updatedBook;
    res.json({ message: 'Updated sucessfully', updatedBook });
    
});


app.listen(port, () => { 
    console.log(`Express app listening on port ${port}!`);
});