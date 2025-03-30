import express from 'express';
import multer from 'multer';
import fs from 'fs';
import { checkAuth } from '../middlewares/index.js';

const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (_, __, callback) => {
    callback(null, uploadDir);
  },
  filename: (_, file, callback) => {
    callback(null, file.originalname);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_, file, callback) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.mimetype)) {
      return callback(new Error('Only image files are allowed'), false);
    }
    callback(null, true);
  },
});

const router = express.Router();

router.post(
  '/upload',
  checkAuth,
  upload.single('image'),
  (req, res) => {
    res.json({
      url: `/uploads/${req.file.originalname}`,
    });
  },
  (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ message: err.message });
    } else if (err) {
      return res.status(500).json({ message: 'Server error' });
    }
  },
);

export default router;
