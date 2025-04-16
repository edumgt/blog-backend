import express from 'express';

import { validateRequest, checkAuth } from '../middlewares';
import { UserController } from '../controllers';
import { loginValidation, registerValidation } from '../validations/userValidation';

const router = express.Router();

router.post('/login', loginValidation, validateRequest, UserController.login);
router.post('/register', registerValidation, validateRequest, UserController.register);
router.get('/me', checkAuth, UserController.getMe);

export default router;
