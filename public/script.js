const bookList = document.querySelector('.book-list');

bookList.addEventListener('click', async (event) => {
    const container = event.target.closest('li');
    const clicked = event.target.closest('button');
    if (!container) return;

    const isDelete = clicked.classList.contains('delete-btn');
    const isEdit = clicked.classList.contains('edit-btn');
    const isSave = clicked.classList.contains('save-btn');
    const isCancel = clicked.classList.contains('cancel-btn');

    if (!(isDelete || isEdit || isSave || isCancel)) return;

    if (isEdit) {
    const form = container.querySelector('.edit-form');
    const details = container.querySelector('.book-details');
    const isHidden = getComputedStyle(form).display === 'none';

        form.style.display = isHidden ? 'block' : 'none';
        details.style.display = isHidden ? 'none' : 'block';
        return;
    }

    if (isSave) {

        const editTitle = container.querySelector('.edit-title');
        const editAuthor = container.querySelector('.edit-author');
        const displayTitle = container.querySelector('.display-title');
        const displayAuthor = container.querySelector('.display-author');
        const details = container.querySelector('.book-details');
        const form = container.querySelector('.edit-form');
        const title = editTitle.value.trim();
        const author = editAuthor.value.trim();
        const bookId = container.dataset.id;

        try {

            if (!title || !author) {
                alert("Both title and author are required.");
                return;
            }

            if (!confirm("Are you sure you want to save the changes?")) return;

            clicked.disabled = true;
            const res = await fetch(`/edit-book/${bookId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, author })
            });

            if (!res.ok) throw new Error('Failed to save changes.');

            displayTitle.textContent = title;
            displayAuthor.textContent = author;
            form.style.display = 'none';
            details.style.display = 'block';

            clicked.disabled = false;
        } catch (err) {
            console.error('Error saving book:', err);
        } finally {
            clicked.disabled = false;
        }
        return;
    }

    if (isCancel) {

    const editTitle = container.querySelector('.edit-title');
    const editAuthor = container.querySelector('.edit-author');
    const displayTitle = container.querySelector('.display-title');
    const displayAuthor = container.querySelector('.display-author');
    const form = container.querySelector('.edit-form');
    const details = container.querySelector('.book-details');

        editTitle.value = displayTitle.textContent;
        editAuthor.value = displayAuthor.textContent;
        form.style.display = 'none';
        details.style.display = 'block';
        return;
    }

    if (isDelete) {
        try {
            const bookId = container.dataset.id;
            if (!confirm("Are you sure you want to delete this item?")) return;

            clicked.disabled = true;
            const res = await fetch(`/remove-book/${bookId}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete item.');

            container.remove();
            console.log('Book deleted successfully!');
            
        } catch (err) {
            console.error(err);
        } finally {
            clicked.disabled = false;
        }
    }
});
