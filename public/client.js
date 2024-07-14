document.addEventListener('DOMContentLoaded', () => {
    const open = document.getElementById('open');
    const modal_container = document.getElementById('modal_container');
    const close = document.getElementById('close');
    const noteForm = document.getElementById('noteForm');
    const gridContainer = document.getElementById('grid-container');

    open.addEventListener('click', () => {
        modal_container.classList.add('show');
    });

    close.addEventListener('click', () => {
        modal_container.classList.remove('show');
    });

    noteForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const title = document.getElementById('title').value;
        const content = document.getElementById('content').value;
        const tags = document.getElementById('tags').value.split(',');

        const newNote = {
            title,
            content,
            tags
        };

        const response = await fetch('/notes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newNote)
        });

        const createdNote = await response.json();
        addNoteToGrid(createdNote);
        modal_container.classList.remove('show');
    });

    const addNoteToGrid = (note) => {
        const noteElement = document.createElement('div');
        noteElement.className = 'grid-item';
        noteElement.innerHTML = `
            <h3>${note.title}</h3>
            <p>${note.content}</p>
            <p><small>${note.createdAt}</small></p>
            <p><small>${note.updatedAt}</small></p>
            <p><small>${note.tags.join(', ')}</small></p>
        `;
        gridContainer.appendChild(noteElement);
    };
});





