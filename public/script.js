const bookList = document.querySelector('.book-list');

bookList.addEventListener('click', function (event) {
    
    if(event.target.classList.contains('btn')) return;

        const container = event.target.closest('li');
        const form = container.querySelector('.edit-form');
        const details = container.querySelector('.book-details');
        const editTitle = container.querySelector('.edit-title');
        const editAuthor = container.querySelector('.edit-author');

    if (event.target.classList.contains('edit-btn')) {
        console.log(details, editTitle, editAuthor);

        const isHidden = form.style.display === 'none' || getComputedStyle(form).display === 'none';

        console.log('form', form);
        console.log('details', details);

        if(isHidden) {
            form.style.display = 'block';
            details.style.display = 'none';
        } else {
            form.style.display = 'none';
            details.style.display = 'block';
        }   

        } else if (event.target.classList.contains('save-btn')) {

            const editedTitle = editTitle.value;
            const editedAuthor = editAuthor.value;
            const displayTitle = container.querySelector('.display-title');
            const displayAuthor = container.querySelector('.display-author');

            displayTitle.textContent = editedTitle;
            displayAuthor.textContent = editedAuthor;
            form.style.display = 'none';
            details.style.display = 'block';

        } else if (event.target.classList.contains('cancel-btn')) {

        }

        const cancelBtn = container.querySelector('.cancel-btn');
        const saveBtn = container.querySelector('.save-btn');
        
});

