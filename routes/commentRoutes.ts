import express from 'express';

import { CommentController } from '../controllers/index';
import { validateRequest, checkAuth } from '../middlewares/index';
import { commentCreateValidation } from '../validations';

const router = express.Router();

router.patch('/:id', checkAuth, commentCreateValidation, validateRequest, CommentController.update);
router.delete('/:id', checkAuth, CommentController.remove);

export default router;
