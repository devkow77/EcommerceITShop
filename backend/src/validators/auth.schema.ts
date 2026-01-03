// src/validators/auth.schema.ts
import { z } from 'zod';

export const registerSchema = z
  .object({
    username: z.string().min(4, {
      message: 'Użytkownik musi mieć min. 4 znaki.',
    }),
    email: z.string().email({
      message: 'Podaj poprawny adres email.',
    }),
    password: z.string().regex(/^(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, {
      message:
        'Hasło musi mieć min. 8 znaków, 1 wielką literę i 1 znak specjalny.',
    }),
    repeatPassword: z.string().regex(/^(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, {
      message:
        'Hasło musi mieć min. 8 znaków, 1 wielką literę i 1 znak specjalny.',
    }),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.repeatPassword) {
      ctx.addIssue({
        path: ['repeatPassword'],
        message: 'Hasła muszą być identyczne',
        code: z.ZodIssueCode.custom,
      });
    }
  });

export const loginSchema = z.object({
  email: z.string().email({
    message: 'Podaj poprawny adres email.',
  }),
  password: z.string().regex(/^(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, {
    message:
      'Hasło musi mieć min. 8 znaków, 1 wielką literę i 1 znak specjalny.',
  }),
});

export const resetPasswordSchema = z.object({
  newPassword: z.string().regex(/^(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, {
    message:
      'Hasło musi mieć min. 8 znaków, 1 wielką literę i 1 znak specjalny.',
  }),
});
