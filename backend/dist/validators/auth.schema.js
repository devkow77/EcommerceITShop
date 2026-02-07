"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordSchema = exports.loginSchema = exports.registerSchema = void 0;
// src/validators/auth.schema.ts
const zod_1 = require("zod");
exports.registerSchema = zod_1.z
    .object({
    name: zod_1.z.string().min(4, {
        message: 'Użytkownik musi mieć min. 4 znaki.',
    }),
    email: zod_1.z.string().email({
        message: 'Podaj poprawny adres email.',
    }),
    password: zod_1.z.string().regex(/^(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, {
        message: 'Hasło musi mieć min. 8 znaków, 1 wielką literę i 1 znak specjalny.',
    }),
    repeatPassword: zod_1.z.string(),
})
    .superRefine((data, ctx) => {
    if (data.password !== data.repeatPassword) {
        ctx.addIssue({
            path: ['repeatPassword'],
            message: 'Hasła muszą być identyczne',
            code: zod_1.z.ZodIssueCode.custom,
        });
    }
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email({
        message: 'Podaj poprawny adres email.',
    }),
    password: zod_1.z.string().regex(/^(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, {
        message: 'Hasło musi mieć min. 8 znaków, 1 wielką literę i 1 znak specjalny.',
    }),
});
exports.resetPasswordSchema = zod_1.z.object({
    newPassword: zod_1.z.string().regex(/^(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, {
        message: 'Hasło musi mieć min. 8 znaków, 1 wielką literę i 1 znak specjalny.',
    }),
});
