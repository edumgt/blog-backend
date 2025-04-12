import jwt, { JwtPayload } from 'jsonwebtoken';
import { NextFunction, Response } from 'express';

import { AuthRequest } from '../types';

export default (req: AuthRequest, res: Response, next: NextFunction): void => {
  const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');

  if (!token) {
    res.status(401).json({
      message: 'No token provided',
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || '') as JwtPayload & { _id: string };
    req.userId = decoded._id;
    next();
  } catch (err) {
    res.status(401).json({
      message: 'Invalid token',
    });
    return;
  }
};
