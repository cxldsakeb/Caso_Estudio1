const express = require('express');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3000;

const PUBLIC = path.join(__dirname, 'public');

app.use(express.static(PUBLIC));
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(PUBLIC, 'home.html'));
});

let notes = [];

app.get('/notes/:id', (req, res) => {
    const { id } = req.params;
    const note = notes.find(note => note.id === id);
    if (!note) {
        res.status(404).json({ error: 'Note not found' });
        return;
    }
    res.json(note);
});

app.post('/notes', (req, res) => {
    try {
        const { title, content, tags } = req.body;
        if (!title || !content) {
            res.status(400).json({ error: 'Title and content are required' });
            return;
        }
        const newNote = {
            id: uuidv4(),
            title,
            content,
            tags,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        notes.push(newNote);

        console.log('Note created:', newNote);
        console.log('Current notes:', notes.map(note => note.id));
        res.json(newNote);
    } catch (error) {
        console.error('Error creating note:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.put('/notes/:id', (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, tags } = req.body;
        const noteIndex = notes.findIndex(note => note.id === id);
        if (noteIndex === -1) {
            res.status(404).json({ error: 'Note not found' });
            return;
        }
        const updatedNote = {
            ...notes[noteIndex],
            title,
            content,
            tags,
            updatedAt: new Date().toISOString()
        };
        notes[noteIndex] = updatedNote;

        console.log('Note updated:', updatedNote);

        res.json(updatedNote);
    } catch (error) {
        console.error('Error updating note:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.delete('/notes/:id', (req, res) => {
    try {
        const { id } = req.params;
        const noteIndex = notes.findIndex(note => note.id === id);
        if (noteIndex === -1) {
            res.status(404).json({ error: 'Note not found' });
            return;
        }
        notes.splice(noteIndex, 1);

        console.log('Note deleted:', id);

        res.status(204).end();
    } catch (error) {
        console.error('Error deleting note:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(PORT, () => {
    console.info(`Server running on port ${PORT}`);
});

