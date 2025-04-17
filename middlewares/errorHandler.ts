import { NextFunction, Request, Response } from 'express';
import { AppError } from '../utils/AppError';

export const errorHandler = (err: unknown, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    console.warn('Handled error:', err.message);
    res.status(err.statusCode).json({
      message: err.message,
    });
    return;
  }

  console.error('Unhandled error:', err);

  res.status(500).json({
    message: 'Internal server error',
  });
};
