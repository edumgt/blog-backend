import express from 'express';

import { validateRequest, checkAuth } from '../middlewares/index';
import { UserController } from '../controllers/index';
import { registerValidation, loginValidation } from '../validations';

const router = express.Router();

router.post('/login', loginValidation, validateRequest, UserController.login);
router.post('/register', registerValidation, validateRequest, UserController.register);
router.get('/me', checkAuth, UserController.getMe);

export default router;
