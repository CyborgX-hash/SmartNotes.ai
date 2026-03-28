const { Router } = require('express');
const authenticate = require('../middleware/auth');
const upload = require('../middleware/upload');
const ctrl = require('../controllers/notesController');

const router = Router();
router.use(authenticate);

router.get('/', ctrl.list);
router.post('/upload', upload.single('file'), ctrl.upload);
router.get('/:id', ctrl.get);
router.delete('/:id', ctrl.remove);

module.exports = router;
