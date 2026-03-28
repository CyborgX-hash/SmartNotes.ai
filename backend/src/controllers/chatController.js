const ragService = require('../services/ragService');

async function ask(req, res, next) {
  try {
    const result = await ragService.askQuestion(req.params.noteId, req.body.question, req.userId);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

async function history(req, res, next) {
  try {
    const messages = await ragService.getChatHistory(req.params.noteId, req.userId);
    res.json(messages);
  } catch (err) {
    next(err);
  }
}

module.exports = { ask, history };
