// src/validators/orders.schema.ts
import { z } from 'zod';

export const updateOrderStatusSchema = z.object({
  status: z.enum(['PENDING', 'PAID', 'SHIPPED', 'COMPLETED', 'CANCELED'], {
    errorMap: () => ({
      message:
        'Status musi być jedną z wartości: PENDING, PAID, SHIPPED, COMPLETED, CANCELED',
    }),
  }),
  totalAmount: z.number().positive('Kwota musi być dodatnia').optional(),
});

export const createOrderSchema = z.object({
  userId: z.number().positive('Nie podano ID użytkownika'),
  totalAmount: z.number().positive('Kwota musi być dodatnia'),
  items: z
    .array(
      z.object({
        productId: z.number().positive('Nie podano ID produktu'),
        quantity: z
          .number()
          .positive('Ilość musi być dodatnia')
          .int('Ilość musi być liczbą całkowitą'),
        price: z.number().positive('Cena musi być dodatnia'),
      }),
    )
    .min(1, 'Zamówienie musi zawierać co najmniej jeden produkt'),
});

export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
