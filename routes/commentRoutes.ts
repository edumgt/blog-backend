import express from 'express';

import { CommentController } from '../controllers/index.js';
import { validateRequest, checkAuth } from '../middlewares/index.js';
import { commentCreateValidation } from '../validations.js';

const router = express.Router();

router.patch('/:id', checkAuth, commentCreateValidation, validateRequest, CommentController.update);
router.delete('/:id', checkAuth, CommentController.remove);

export default router;
