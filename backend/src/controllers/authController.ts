import { Request, Response } from 'express';
import prisma from '../prisma';
import bcrypt from 'bcrypt';
import { generateToken } from '../utils/jwt';
import {
  registerSchema,
  loginSchema,
  resetPasswordSchema,
} from '../validators/auth.schema';
import jwt from 'jsonwebtoken';

// rejestracja użytkownika
export const createUser = async (req: Request, res: Response) => {
  const parsedBody = registerSchema.safeParse(req.body);
  if (!parsedBody.success) {
    return res.status(400).json({ msg: 'Nieprawidłowe dane rejestracji' });
  }

  const { name, email, password } = req.body || {};

  if (!name || !email || !password) {
    return res.status(400).json({ msg: 'Wszystkie pola są wymagane' });
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return res.status(409).json({ msg: 'Konto z tym emailem już istnieje' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return res
      .status(201)
      .json({ msg: 'Pomyślnie utworzono nowego użytkownika!' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: 'Wewnętrzny błąd serwera!' });
  }
};

// logowanie użytkownika
export const signIn = async (req: Request, res: Response) => {
  const parsedBody = loginSchema.safeParse(req.body);
  if (!parsedBody.success) {
    return res.status(400).json({ msg: 'Nieprawidłowe dane logowania' });
  }

  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ msg: 'Wszystkie pola są wymagane' });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res
      .status(401)
      .json({ msg: 'Nie istnieje użytkownik o podanym adresie email' });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ msg: 'Nieprawidłowe dane logowania' });
  }

  const token = generateToken({ userId: user.id });
  res
    .cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60, // 1 godzina
    })
    .status(200)
    .json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
};

// pobranie informacji o zalogowanym użytkowniku
export const authInfo = async (req: Request, res: Response) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ msg: 'Brak tokenu uwierzytelniającego' });
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: number;
    };

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, name: true, email: true, createdAt: true },
    });

    return res.status(200).json(user);
  } catch (err) {
    return res
      .status(401)
      .json({ msg: 'Nieprawidłowy token uwierzytelniający' });
  }
};

// wylogowanie użytkownika (usuniecie tokenu)
export const logout = (req: Request, res: Response) => {
  res
    .clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    })
    .status(200)
    .json({ msg: 'Pomyślnie wylogowano' });
};

// reset hasła użytkownika
export const resetPassword = async (req: Request, res: Response) => {
  const token = req.cookies.token;
  const { newPassword } = req.body || {};

  const parsedPassword = resetPasswordSchema.safeParse(req.body);
  if (!parsedPassword.success) {
    return res.status(400).json({
      msg: 'Hasło musi mieć min. 8 znaków, 1 wielką literę i 1 znak specjalny.',
    });
  }

  if (!token) {
    return res.status(401).json({ msg: 'Brak tokenu uwierzytelniającego' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: number;
    };

    const newHashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: payload.userId },
      data: { password: newHashedPassword },
    });

    res.status(200).json({ msg: 'Hasło zostało zmienione!' });
  } catch (err) {
    console.error(err);
    res.status(401).json({ msg: 'Nieprawidłowy token uwierzytelniający' });
  }
};
