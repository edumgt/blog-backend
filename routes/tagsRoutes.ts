import express from 'express';

import { PostController } from '../controllers';

const router = express.Router();

router.get('/tags', PostController.getLastTags);

export default router;
