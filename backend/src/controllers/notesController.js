const noteService = require('../services/noteService');

async function upload(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const note = await noteService.createNote({ file: req.file, userId: req.userId });
    res.status(201).json(note);
  } catch (err) {
    next(err);
  }
}

async function list(req, res, next) {
  try {
    const notes = await noteService.getUserNotes(req.userId);
    res.json(notes);
  } catch (err) {
    next(err);
  }
}

async function get(req, res, next) {
  try {
    const note = await noteService.getNote(req.params.id, req.userId);
    res.json(note);
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    await noteService.deleteNote(req.params.id, req.userId);
    res.json({ message: 'Note deleted successfully' });
  } catch (err) {
    next(err);
  }
}

module.exports = { upload, list, get, remove };
