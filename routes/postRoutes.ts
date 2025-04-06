import express from 'express';

import { PostController } from '../controllers/index.js';
import { validateRequest, checkAuth } from '../middlewares/index.js';
import { postCreateValidation } from '../validations.js';

const router = express.Router();

router.get('/', PostController.getAll);
router.get('/:id', PostController.getOne);
router.post('/create', checkAuth, postCreateValidation, validateRequest, PostController.create);
router.delete('/:id', checkAuth, PostController.remove);
router.patch('/:id', checkAuth, postCreateValidation, validateRequest, PostController.update);

export default router;
