import express from 'express';

import { CommentController, PostController } from '../controllers';
import { validateRequest, checkAuth } from '../middlewares';
import { commentCreateValidation, postCreateValidation } from '../validations/postValidation';

const router = express.Router();

router.get('/', PostController.getAll);
router.get('/:id', PostController.getOne);
router.post('/', checkAuth, postCreateValidation, validateRequest, PostController.create);
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
