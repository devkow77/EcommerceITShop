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
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';

// rejestracja użytkownika
export const createUser = async (req: Request, res: Response) => {
  const parsedBody = registerSchema.safeParse(req.body);
  if (!parsedBody.success) {
    return res.status(400).json({ msg: 'Nieprawidłowe dane rejestracji' });
  }

  const { name, email, password, repeatPassword } = req.body || {};

  if (!name || !email || !password || !repeatPassword) {
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

  const user = await prisma.user.findUnique({
    where: { email },
  });
  if (!user) {
    return res
      .status(401)
      .json({ msg: 'Nie istnieje użytkownik o podanym adresie email' });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ msg: 'Nieprawidłowe dane logowania' });
  }

  if (user.totpEnabled) {
    const tempToken = jwt.sign(
      {
        userId: user.id,
        twoFactor: true,
      },
      process.env.JWT_SECRET!,
      { expiresIn: '5m' }, // krótko!
    );

    return res.status(200).json({
      requires2FA: true,
      tempToken,
    });
  }

  // normalne logowanie
  const token = generateToken({ userId: user.id });
  res
    .cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60,
    })
    .status(200)
    .json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
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
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        totpEnabled: true,
        role: true,
      },
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

// Wygeneruj kod TOTP
export const generateTotp = async (req: Request, res: Response) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ msg: 'Brak tokenu uwierzytelniającego' });
  }

  const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
    userId: number;
  };

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
  });

  if (!user) {
    return res.status(404).json({ msg: 'Użytkownik nie istnieje' });
  }

  let secretBase32 = user.totpSecret;
  let otpauthUrl: string;

  // 🔐 generujemy sekret TYLKO jeśli nie istnieje
  if (!secretBase32) {
    const secret = speakeasy.generateSecret({
      name: `EcommerceITShop (${user.email})`,
    });

    if (!secret.otpauth_url) {
      throw new Error('Nie udało się wygenerować URL');
    }

    secretBase32 = secret.base32;
    otpauthUrl = secret.otpauth_url;

    await prisma.user.update({
      where: { id: user.id },
      data: {
        totpSecret: secretBase32,
        totpEnabled: false,
      },
    });
  } else {
    // 🔁 sekret już istnieje → generujemy QR z istniejącego
    otpauthUrl = speakeasy.otpauthURL({
      secret: secretBase32,
      label: `EcommerceITShop (${user.email})`,
      issuer: 'EcommerceITShop',
      encoding: 'base32',
    });
  }

  const qrCode = await QRCode.toDataURL(otpauthUrl);

  return res.status(200).json({
    qrCode,
    manualKey: secretBase32,
  });
};

// Werifikuj kod TOPT
export const verifyTotp = async (req: Request, res: Response) => {
  const token = req.cookies.token;
  const { code } = req.body;

  if (!token)
    return res.status(401).json({ msg: 'Brak tokenu uwierzytelniającego' });
  if (!code) return res.status(400).json({ msg: 'Kod TOTP jest wymagany' });

  const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
    userId: number;
  };

  const user = await prisma.user.findUnique({ where: { id: payload.userId } });
  if (!user || !user.totpSecret)
    return res.status(400).json({ msg: '2FA nie zostało zainicjalizowane' });

  const verified = speakeasy.totp.verify({
    secret: user.totpSecret,
    encoding: 'base32',
    token: code,
    window: 1,
  });

  if (!verified) return res.status(400).json({ msg: 'Nieprawidłowy kod TOTP' });

  await prisma.user.update({
    where: { id: user.id },
    data: { totpEnabled: true },
  });

  res.status(200).json({ msg: 'Uwierzytelnianie dwuetapowe włączone' });
};

// wyłącz TOTP
export const disableTotp = async (req: Request, res: Response) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ msg: 'Brak tokenu' });
  }

  const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
    userId: number;
  };

  await prisma.user.update({
    where: { id: payload.userId },
    data: {
      totpSecret: null,
      totpEnabled: false,
    },
  });

  res.status(200).json({ msg: '2FA zostało wyłączone' });
};

// Logowanie z włączonym totp
export const loginWithTotp = async (req: Request, res: Response) => {
  const { code, tempToken } = req.body;

  if (!code || !tempToken) {
    return res.status(400).json({ msg: 'Brak danych' });
  }

  let payload;
  try {
    payload = jwt.verify(tempToken, process.env.JWT_SECRET!) as {
      userId: number;
      twoFactor: boolean;
    };
  } catch {
    return res.status(401).json({ msg: 'Token wygasł' });
  }

  if (!payload.twoFactor) {
    return res.status(401).json({ msg: 'Nieprawidłowy token' });
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
  });

  if (!user || !user.totpSecret) {
    return res.status(400).json({ msg: '2FA nieaktywne' });
  }

  const verified = speakeasy.totp.verify({
    secret: user.totpSecret,
    encoding: 'base32',
    token: code,
    window: 1,
  });

  if (!verified) {
    return res.status(400).json({ msg: 'Nieprawidłowy kod' });
  }

  // 🔐 FINALNE LOGOWANIE
  const token = generateToken({ userId: user.id });

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 1000 * 60 * 60,
  });

  res.status(200).json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  });
};
