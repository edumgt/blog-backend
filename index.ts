import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

import postRoutes from './routes/postRoutes';
import uploadRoutes from './routes/uploadRoutes';
import tagsRoutes from './routes/tagsRoutes';
import commentRoutes from './routes/commentRoutes';
import userRoutes from './routes/userRoutes';
import { errorHandler } from './middlewares/errorHandler';

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI || '')
  .then(() => console.log('DB OK'))
  .catch((err) => console.log('DB error', err));

const app = express();

app.use(express.json());
app.use(cors());

app.use('/auth', userRoutes);
app.use('/posts', postRoutes);
app.use('/comments', commentRoutes);
app.use(uploadRoutes);
app.use(tagsRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log(`Server running on port ${PORT}`);
});
