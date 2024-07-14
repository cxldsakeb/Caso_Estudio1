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

app.get('/notes', (req, res) => {
    res.json(notes);
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

        res.json(newNote);
    } catch (error) {
        console.error('Error creating note:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(PORT, () => {
    console.info(`Server running on port ${PORT}`);
});

