"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginWithTotp = exports.disableTotp = exports.verifyTotp = exports.generateTotp = exports.resetPassword = exports.logout = exports.authInfo = exports.signIn = exports.createUser = void 0;
const prisma_1 = __importDefault(require("../prisma"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwt_1 = require("../utils/jwt");
const auth_schema_1 = require("../validators/auth.schema");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const speakeasy_1 = __importDefault(require("speakeasy"));
const qrcode_1 = __importDefault(require("qrcode"));
// rejestracja użytkownika
const createUser = async (req, res) => {
    const parsedBody = auth_schema_1.registerSchema.safeParse(req.body);
    if (!parsedBody.success) {
        return res.status(400).json({ msg: 'Nieprawidłowe dane rejestracji' });
    }
    const { name, email, password, repeatPassword } = req.body || {};
    if (!name || !email || !password || !repeatPassword) {
        return res.status(400).json({ msg: 'Wszystkie pola są wymagane' });
    }
    const existingUser = await prisma_1.default.user.findUnique({ where: { email } });
    if (existingUser) {
        return res.status(409).json({ msg: 'Konto z tym emailem już istnieje' });
    }
    try {
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        await prisma_1.default.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });
        return res
            .status(201)
            .json({ msg: 'Pomyślnie utworzono nowego użytkownika!' });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ msg: 'Wewnętrzny błąd serwera!' });
    }
};
exports.createUser = createUser;
// logowanie użytkownika
const signIn = async (req, res) => {
    const parsedBody = auth_schema_1.loginSchema.safeParse(req.body);
    if (!parsedBody.success) {
        return res.status(400).json({ msg: 'Nieprawidłowe dane logowania' });
    }
    const { email, password } = req.body || {};
    if (!email || !password) {
        return res.status(400).json({ msg: 'Wszystkie pola są wymagane' });
    }
    const user = await prisma_1.default.user.findUnique({
        where: { email },
    });
    if (!user) {
        return res
            .status(401)
            .json({ msg: 'Nie istnieje użytkownik o podanym adresie email' });
    }
    const isMatch = await bcrypt_1.default.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({ msg: 'Nieprawidłowe dane logowania' });
    }
    if (user.totpEnabled) {
        const tempToken = jsonwebtoken_1.default.sign({
            userId: user.id,
            twoFactor: true,
        }, process.env.JWT_SECRET, { expiresIn: '5m' });
        return res.status(200).json({
            requires2FA: true,
            tempToken,
        });
    }
    // normalne logowanie
    const token = (0, jwt_1.generateToken)({ userId: user.id });
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
exports.signIn = signIn;
// pobranie informacji o zalogowanym użytkowniku
const authInfo = async (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ msg: 'Brak tokenu uwierzytelniającego' });
    }
    try {
        const payload = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const user = await prisma_1.default.user.findUnique({
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
    }
    catch (err) {
        return res
            .status(401)
            .json({ msg: 'Nieprawidłowy token uwierzytelniający' });
    }
};
exports.authInfo = authInfo;
// wylogowanie użytkownika (usuniecie tokenu)
const logout = (req, res) => {
    res
        .clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
    })
        .status(200)
        .json({ msg: 'Pomyślnie wylogowano' });
};
exports.logout = logout;
// reset hasła użytkownika
const resetPassword = async (req, res) => {
    const token = req.cookies.token;
    const { newPassword } = req.body || {};
    const parsedPassword = auth_schema_1.resetPasswordSchema.safeParse(req.body);
    if (!parsedPassword.success) {
        return res.status(400).json({
            msg: 'Hasło musi mieć min. 8 znaków, 1 wielką literę i 1 znak specjalny.',
        });
    }
    if (!token) {
        return res.status(401).json({ msg: 'Brak tokenu uwierzytelniającego' });
    }
    try {
        const payload = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const newHashedPassword = await bcrypt_1.default.hash(newPassword, 10);
        await prisma_1.default.user.update({
            where: { id: payload.userId },
            data: { password: newHashedPassword },
        });
        res.status(200).json({ msg: 'Hasło zostało zmienione!' });
    }
    catch (err) {
        console.error(err);
        res.status(401).json({ msg: 'Nieprawidłowy token uwierzytelniający' });
    }
};
exports.resetPassword = resetPassword;
// Wygeneruj kod TOTP
const generateTotp = async (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ msg: 'Brak tokenu uwierzytelniającego' });
    }
    const payload = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
    const user = await prisma_1.default.user.findUnique({
        where: { id: payload.userId },
    });
    if (!user) {
        return res.status(404).json({ msg: 'Użytkownik nie istnieje' });
    }
    let secretBase32 = user.totpSecret;
    let otpauthUrl;
    // 🔐 generujemy sekret TYLKO jeśli nie istnieje
    if (!secretBase32) {
        const secret = speakeasy_1.default.generateSecret({
            name: `EcommerceITShop (${user.email})`,
        });
        if (!secret.otpauth_url) {
            throw new Error('Nie udało się wygenerować URL');
        }
        secretBase32 = secret.base32;
        otpauthUrl = secret.otpauth_url;
        await prisma_1.default.user.update({
            where: { id: user.id },
            data: {
                totpSecret: secretBase32,
                totpEnabled: false,
            },
        });
    }
    else {
        // 🔁 sekret już istnieje → generujemy QR z istniejącego
        otpauthUrl = speakeasy_1.default.otpauthURL({
            secret: secretBase32,
            label: `EcommerceITShop (${user.email})`,
            issuer: 'EcommerceITShop',
            encoding: 'base32',
        });
    }
    const qrCode = await qrcode_1.default.toDataURL(otpauthUrl);
    return res.status(200).json({
        qrCode,
        manualKey: secretBase32,
    });
};
exports.generateTotp = generateTotp;
// Werifikuj kod TOPT
const verifyTotp = async (req, res) => {
    const token = req.cookies.token;
    const { code } = req.body;
    if (!token)
        return res.status(401).json({ msg: 'Brak tokenu uwierzytelniającego' });
    if (!code)
        return res.status(400).json({ msg: 'Kod TOTP jest wymagany' });
    const payload = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
    const user = await prisma_1.default.user.findUnique({ where: { id: payload.userId } });
    if (!user || !user.totpSecret)
        return res.status(400).json({ msg: '2FA nie zostało zainicjalizowane' });
    const verified = speakeasy_1.default.totp.verify({
        secret: user.totpSecret,
        encoding: 'base32',
        token: code,
        window: 1,
    });
    if (!verified)
        return res.status(400).json({ msg: 'Nieprawidłowy kod TOTP' });
    await prisma_1.default.user.update({
        where: { id: user.id },
        data: { totpEnabled: true },
    });
    res.status(200).json({ msg: 'Uwierzytelnianie dwuetapowe włączone' });
};
exports.verifyTotp = verifyTotp;
// wyłącz TOTP
const disableTotp = async (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ msg: 'Brak tokenu' });
    }
    const payload = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
    await prisma_1.default.user.update({
        where: { id: payload.userId },
        data: {
            totpSecret: null,
            totpEnabled: false,
        },
    });
    res.status(200).json({ msg: '2FA zostało wyłączone' });
};
exports.disableTotp = disableTotp;
// Logowanie z włączonym totp
const loginWithTotp = async (req, res) => {
    const { code, tempToken } = req.body;
    if (!code || !tempToken) {
        return res.status(400).json({ msg: 'Brak danych' });
    }
    let payload;
    try {
        payload = jsonwebtoken_1.default.verify(tempToken, process.env.JWT_SECRET);
    }
    catch {
        return res.status(401).json({ msg: 'Token wygasł' });
    }
    if (!payload.twoFactor) {
        return res.status(401).json({ msg: 'Nieprawidłowy token' });
    }
    const user = await prisma_1.default.user.findUnique({
        where: { id: payload.userId },
    });
    if (!user || !user.totpSecret) {
        return res.status(400).json({ msg: '2FA nieaktywne' });
    }
    const verified = speakeasy_1.default.totp.verify({
        secret: user.totpSecret,
        encoding: 'base32',
        token: code,
        window: 1,
    });
    if (!verified) {
        return res.status(400).json({ msg: 'Nieprawidłowy kod' });
    }
    // 🔐 FINALNE LOGOWANIE
    const token = (0, jwt_1.generateToken)({ userId: user.id });
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
exports.loginWithTotp = loginWithTotp;
