"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrderSchema = exports.updateOrderStatusSchema = void 0;
// src/validators/orders.schema.ts
const zod_1 = require("zod");
exports.updateOrderStatusSchema = zod_1.z.object({
    status: zod_1.z.enum(['PENDING', 'PAID', 'SHIPPED', 'COMPLETED', 'CANCELED'], {
        errorMap: () => ({
            message: 'Status musi być jedną z wartości: PENDING, PAID, SHIPPED, COMPLETED, CANCELED',
        }),
    }),
    totalAmount: zod_1.z.number().positive('Kwota musi być dodatnia').optional(),
});
exports.createOrderSchema = zod_1.z.object({
    userId: zod_1.z.number().positive('Nie podano ID użytkownika'),
    totalAmount: zod_1.z.number().positive('Kwota musi być dodatnia'),
    items: zod_1.z
        .array(zod_1.z.object({
        productId: zod_1.z.number().positive('Nie podano ID produktu'),
        quantity: zod_1.z
            .number()
            .positive('Ilość musi być dodatnia')
            .int('Ilość musi być liczbą całkowitą'),
        price: zod_1.z.number().positive('Cena musi być dodatnia'),
    }))
        .min(1, 'Zamówienie musi zawierać co najmniej jeden produkt'),
});
