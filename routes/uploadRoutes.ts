import express from 'express';
import multer, { MulterError } from 'multer';
import fs from 'fs';
import { Request, Response, NextFunction } from 'express';

import { checkAuth } from '../middlewares/index';

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
      return callback(null, false);
    }
    callback(null, true);
  },
});

const router = express.Router();

router.post(
  '/upload',
  checkAuth,
  upload.single('image'),
  (req: Request, res: Response) => {
    if (!req.file) {
      res.status(400).json({ message: 'No file uploaded' });
      return;
    }
    res.json({
      url: `/uploads/${req.file.originalname}`,
    });
  },
  (err: MulterError | Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof multer.MulterError) {
      res.status(400).json({ message: err.message });
      return;
    } else if (err) {
      res.status(500).json({ message: 'Server error' });
      return;
    }
  },
);

export default router;
