const { Router } = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const authenticate = require('../middleware/auth');
const ctrl = require('../controllers/quizController');

const router = Router();
router.use(authenticate);

router.post(
  '/:noteId/generate',
  [
    body('difficulty').isIn(['easy', 'medium', 'hard']).withMessage('Difficulty must be easy, medium, or hard'),
    body('numQuestions').isInt({ min: 1, max: 20 }).withMessage('Number of questions must be 1-20'),
    validate,
  ],
  ctrl.generate
);

router.get('/:noteId/history', ctrl.history);

module.exports = router;
