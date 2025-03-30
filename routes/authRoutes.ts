import express from 'express';

import { validateRequest, checkAuth } from '../middlewares/index.js';
import { UserController } from '../controllers/index.js';
import { registerValidation, loginValidation } from '../validations.js';

const router = express.Router();

router.post('/login', loginValidation, validateRequest, UserController.login);
router.post('/register', registerValidation, validateRequest, UserController.register);
router.get('/me', checkAuth, UserController.getMe);

export default router;
