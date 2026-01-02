import jwt from 'jsonwebtoken';

const JWT_SECRET: string = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

export const generateToken = (payload: object) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: Number(JWT_EXPIRES_IN) });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET);
};
