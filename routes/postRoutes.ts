import express from 'express';

import { CommentController, PostController } from '../controllers/index';
import { validateRequest, checkAuth } from '../middlewares/index';
import { commentCreateValidation, postCreateValidation } from '../validations';

const router = express.Router();

router.get('/', PostController.getAll);
router.get('/:id', PostController.getOne);
router.post('/create', checkAuth, postCreateValidation, validateRequest, PostController.create);
router.patch('/:id', checkAuth, postCreateValidation, validateRequest, PostController.update);
router.delete('/:id', checkAuth, PostController.remove);

router.get('/:id/comments', CommentController.getPostComments);
router.post(
  '/:id/comments',
  checkAuth,
  commentCreateValidation,
  validateRequest,
  CommentController.create,
);

export default router;
