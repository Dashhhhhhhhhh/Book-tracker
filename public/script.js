document.querySelectorAll('.delete-btn').forEach(button => {
    button.addEventListener('click', async () => {
        const bookId = button.parentElement.getAttribute('data-id');
        
        const res = await fetch (`remove-book/${bookId}`, {
        method: 'DELETE'
        });
        const data = await res.json();
        console.log(data);

        button.parentElement.remove(bookId);
    });
});