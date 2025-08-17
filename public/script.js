const form = document.querySelector("form");
const bookList = document.querySelector(".book-list");
const emptyMsg = document.querySelector(".empty-msg");

// Load all books from the database
async function loadBooks() {
  try {
    const res = await fetch("/books");
    if (!res.ok) throw new Error("Failed to fetch books");

    const books = await res.json();

    bookList.innerHTML = "";
    if (books.length === 0) {
      emptyMsg.style.display = "block";
      return;
    }
    emptyMsg.style.display = "none";

    books.forEach(book => {
      const li = document.createElement("li");
      li.dataset.id = book.id;
      li.innerHTML = `
        <strong>${book.title}</strong> by ${book.author}
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">Delete</button>
      `;
      bookList.appendChild(li);
    });
  } catch (err) {
    console.error("Error loading books:", err);
  }
}

// Add a new book
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = form.title.value.trim();
  const author = form.author.value.trim();
  if (!title || !author) return;

  try {
    const res = await fetch("/add-book", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, author })
    });

    if (!res.ok) {
      const err = await res.json();
      alert(err.error);
      return;
    }

    form.reset();
    await loadBooks(); // reload books so the new book appears
  } catch (err) {
    console.error("Error adding book:", err);
  }
});

// Update a book
async function updateBook(id, newTitle, newAuthor) {
  try {
    const res = await fetch(`/edit-book/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTitle, author: newAuthor })
    });

    if (!res.ok) {
      const err = await res.json();
      alert(err.error);
      return;
    }

    await loadBooks(); // refresh the list after edit
  } catch (err) {
    console.error("Error updating book:", err);
  }
}

// Delete a book
async function deleteBook(id) {
  try {
    const res = await fetch(`/remove-book/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const err = await res.json();
      alert(err.error);
      return;
    }

    await loadBooks(); // refresh the list after delete
  } catch (err) {
    console.error("Error deleting book:", err);
  }
}

// Event delegation for edit and delete buttons
bookList.addEventListener("click", async (e) => {
  const clicked = e.target;
  const li = clicked.closest("li");
  if (!li) return;

  const bookId = li.dataset.id;

  if (clicked.classList.contains("delete-btn")) {
    if (confirm("Are you sure you want to delete this book?")) {
      await deleteBook(bookId);
    }
  }

  if (clicked.classList.contains("edit-btn")) {
    const currentTitle = li.querySelector("strong").innerText;
    const currentAuthor = li.innerText.split(" by ")[1].replace(/EditDelete$/, "").trim();

    const newTitle = prompt("Enter new title:", currentTitle);
    const newAuthor = prompt("Enter new author:", currentAuthor);

    if (newTitle && newAuthor) {
      await updateBook(bookId, newTitle, newAuthor);
    }
  }
});

// Load books when the page starts
loadBooks();
