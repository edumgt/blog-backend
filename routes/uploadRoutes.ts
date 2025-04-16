import express, { Request, Response, NextFunction } from 'express';
import multer, { MulterError } from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

import { checkAuth } from '../middlewares';
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (_, file) => ({
    folder: 'your-app-images',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
    public_id: file.originalname.split('.')[0],
  }),
});

const upload = multer({ storage });

const router = express.Router();

router.post(
  '/upload',
  checkAuth,
  upload.single('image'),
  (req: Request, res: Response) => {
    if (!req.file || !('path' in req.file)) {
      res.status(400).json({ message: 'No file uploaded' });
      return;
    }

    const file = req.file as Express.Multer.File & { path: string };

    res.json({
      url: file.path,
    });
  },
  (err: MulterError | Error, _: Request, res: Response, __: NextFunction) => {
    if (err instanceof multer.MulterError) {
      res.status(400).json({ message: err.message });
    } else if (err) {
      res.status(500).json({ message: 'Server error' });
    }
  },
);

export default router;
