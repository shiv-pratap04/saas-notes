const Note = require('../models/Note');
const Tenant = require('../models/Tenant');

// @desc    Create a note
// @route   POST /api/notes
exports.createNote = async (req, res) => {
    const { title, content } = req.body;
    const { userId, tenantId } = req.user; // From authMiddleware

    try {
        const tenant = await Tenant.findById(tenantId);

        // Subscription Gating
        if (tenant.plan === 'FREE') {
            const noteCount = await Note.countDocuments({ tenantId });
            if (noteCount >= 3) {
                return res.status(403).json({ message: 'Free plan limit of 3 notes reached. Please upgrade.' });
            }
        }

        const note = await Note.create({
            title,
            content,
            authorId: userId,
            tenantId,
        });

        res.status(201).json(note);
    } catch (error) {
        res.status(500).json({ message: 'Server error creating note' });
    }
};

// @desc    Get all notes for a tenant
// @route   GET /api/notes
exports.getNotes = async (req, res) => {
    try {
        // IMPORTANT: The { tenantId: req.user.tenantId } filter ensures data isolation.
        const notes = await Note.find({ tenantId: req.user.tenantId }).sort({ createdAt: -1 });
        res.json(notes);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching notes' });
    }
};

// @desc    Delete a note
// @route   DELETE /api/notes/:id
exports.deleteNote = async (req, res) => {
    try {
        // Find note by ID AND tenantId to ensure a user can't delete another tenant's notes.
        const note = await Note.findOne({ _id: req.params.id, tenantId: req.user.tenantId });
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }
        await note.remove();
        res.status(204).send(); // No content
    } catch (error) {
        res.status(500).json({ message: 'Server error deleting note' });
    }
};