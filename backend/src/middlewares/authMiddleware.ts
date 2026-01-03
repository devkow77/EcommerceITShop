import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ msg: 'Brak tokenu' });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: number;
    };
    (req as any).userId = payload.userId;
    next();
  } catch (err) {
    return res.status(401).json({ msg: 'Nieprawidłowy token' });
  }
};
