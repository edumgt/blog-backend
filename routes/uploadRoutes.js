import express from 'express';
import multer from 'multer';

import { checkAuth } from '../middlewares/index.js';

const router = express.Router();

const storage = multer.diskStorage({
  destination: (_, __, callback) => {
    callback(null, 'uploads');
  },
  filename: (_, file, callback) => {
    callback(null, file.originalname);
  },
});

const upload = multer({ storage });

router.post('/upload', checkAuth, upload.single('image'), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

export default router;
