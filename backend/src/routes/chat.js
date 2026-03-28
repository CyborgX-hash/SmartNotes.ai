const { Router } = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const authenticate = require('../middleware/auth');
const ctrl = require('../controllers/chatController');

const router = Router();
router.use(authenticate);

router.post(
  '/:noteId/ask',
  [body('question').trim().notEmpty().withMessage('Question is required'), validate],
  ctrl.ask
);

router.get('/:noteId/history', ctrl.history);

module.exports = router;
