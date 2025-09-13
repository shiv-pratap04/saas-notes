import React, { useState, useEffect } from 'react';
import API from '../services/api';

const DashboardPage = ({ onLogout }) => {
    const [notes, setNotes] = useState([]);
    const [title, setTitle] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        fetchNotes();
    }, []);

    const fetchNotes = async () => {
        try {
            const { data } = await API.get('/notes');
            setNotes(data);
        } catch (err) {
            console.error("Failed to fetch notes", err);
            setError("Could not fetch your notes.");
        }
    };

    const handleCreateNote = async (e) => {
        e.preventDefault();
        if (!title) return;
        setError('');
        try {
            await API.post('/notes', { title });
            setTitle('');
            fetchNotes(); // Refresh list
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create note.');
        }
    };
    
    const handleDeleteNote = async (id) => {
        try {
            await API.delete(`/notes/${id}`);
            fetchNotes(); // Refresh list
        } catch (err) {
            console.error("Failed to delete note", err);
            setError("Could not delete the note.");
        }
    };

    return (
        <div className="app-container">
            <div className="card" style={{ maxWidth: '600px' }}>
                <div className="dashboard-header">
                    <h1>My Notes</h1>
                    <button onClick={onLogout} className="logout-btn">Logout</button>
                </div>
                
                <form onSubmit={handleCreateNote}>
                    <div className="form-group">
                        <input
                            type="text"
                            className="form-input"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter a new note title..."
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">Add Note</button>
                </form>

                {error && <p className="error-message">{error}</p>}

                <ul className="notes-list">
                    {notes.length > 0 ? (
                        notes.map(note => (
                            <li key={note._id} className="note-item">
                                <span>{note.title}</span>
                                <button onClick={() => handleDeleteNote(note._id)} className="delete-btn">Delete</button>
                            </li>
                        ))
                    ) : (
                        <p style={{ textAlign: 'center', color: '#888' }}>You have no notes yet.</p>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default DashboardPage;