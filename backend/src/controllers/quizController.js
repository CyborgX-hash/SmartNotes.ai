const quizService = require('../services/quizService');

async function generate(req, res, next) {
  try {
    const { difficulty, numQuestions } = req.body;
    const quiz = await quizService.generateQuiz(req.params.noteId, req.userId, {
      difficulty,
      numQuestions: parseInt(numQuestions),
    });
    res.status(201).json(quiz);
  } catch (err) {
    next(err);
  }
}

async function history(req, res, next) {
  try {
    const quizzes = await quizService.getQuizHistory(req.params.noteId, req.userId);
    res.json(quizzes);
  } catch (err) {
    next(err);
  }
}

module.exports = { generate, history };
