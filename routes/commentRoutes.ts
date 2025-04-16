import express from 'express';

import { CommentController } from '../controllers';
import { validateRequest, checkAuth } from '../middlewares';
import { commentCreateValidation } from '../validations/postValidation';

const router = express.Router();

router.patch('/:id', checkAuth, commentCreateValidation, validateRequest, CommentController.update);
router.delete('/:id', checkAuth, CommentController.remove);

export default router;
