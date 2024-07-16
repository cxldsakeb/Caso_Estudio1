document.addEventListener('DOMContentLoaded', () => {
    const open = document.getElementById('open');
    const modal_container = document.getElementById('modal_container');
    const noteForm = document.getElementById('noteForm');
    const gridContainer = document.getElementById('grid-container');
    const deleteButton = document.getElementById('delete');
    const cancelButton = document.getElementById('cancel');
    const modalTitle = document.getElementById('modal_title');

    let editingNoteId = null;

    open.addEventListener('click', () => {
        openModal();
    });

    cancelButton.addEventListener('click', () => {
        closeModal();
    });

    noteForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const title = document.getElementById('title').value;
        const content = document.getElementById('content').value;
        const tags = document.getElementById('tags').value.split(',').map(tag => tag.trim());

        const noteData = {
            title,
            content,
            tags
        };

        const method = editingNoteId ? 'PUT' : 'POST';
        const url = editingNoteId ? `/notes/${editingNoteId}` : '/notes';

        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(noteData)
        });

        const updatedNote = await response.json();

        if (editingNoteId) {
            updateNoteInGrid(updatedNote);
        } else {
            addNoteToGrid(updatedNote);
        }

        closeModal();
    });

    deleteButton.addEventListener('click', async () => {
        if (!editingNoteId) return;

        const response = await fetch(`/notes/${editingNoteId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            removeNoteFromGrid(editingNoteId);
            closeModal();
        } else {
            console.error('Error deleting note');
        }
    });

    const openModal = (note = null) => {
        if (note) {
            document.getElementById('title').value = note.title;
            document.getElementById('content').value = note.content;
            document.getElementById('tags').value = note.tags.join(', ');
            deleteButton.style.display = 'block';
            modalTitle.textContent = 'Edit Note';
            editingNoteId = note.id;
        } else {
            document.getElementById('noteForm').reset();
            deleteButton.style.display = 'none';
            modalTitle.textContent = 'Write a new Note!!';
            editingNoteId = null;
        }
        modal_container.classList.add('show');
    };

    const closeModal = () => {
        modal_container.classList.remove('show');
        editingNoteId = null;
    };

    const addNoteToGrid = (note) => {
        const noteElement = document.createElement('div');
        noteElement.className = 'grid-item';
        noteElement.dataset.id = note.id;
        noteElement.innerHTML =`
            <h3>${note.title}</h3>
            <p>${note.content}</p>
            <p><small>${note.createdAt}</small></p>
            <p><small>${note.updatedAt}</small></p>
            <p><small>${note.tags.join(', ')}</small></p>
            <button class="button -edit" onclick="editNote('${note.id}')">Edit</button>
        `;
        gridContainer.appendChild(noteElement);
    };

    const updateNoteInGrid = (note) => {
        const noteElement = document.querySelector(`.grid-item[data-id="${note.id}"]`);
        if (noteElement) {
            noteElement.innerHTML = `
                <h3>${note.title}</h3>
                <p>${note.content}</p>
                <p><small>${note.createdAt}</small></p>
                <p><small>${note.updatedAt}</small></p>
                <p><small>${note.tags.join(', ')}</small></p>
                <button class="button -edit" onclick="editNote('${note.id}')">Edit</button>
            `;
        }
    };

    const removeNoteFromGrid = (noteId) => {
        const noteElement = document.querySelector(`.grid-item[data-id="${noteId}"]`);
        if (noteElement) {
            noteElement.remove();
        }
    };

    window.editNote = async (noteId) => {
        const response = await fetch(`/notes/${noteId}`);
        if (response.ok) {
            const note = await response.json();
            openModal(note);
        } else {
            console.error('Note not found');
        }
    };

    const fetchNotes = async () => {
        const response = await fetch('/notes');
        const notes = await response.json();
        notes.forEach(addNoteToGrid);
    };

    fetchNotes();
});






