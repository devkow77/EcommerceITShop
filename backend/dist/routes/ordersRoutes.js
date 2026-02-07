"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ordersController_1 = require("../controllers/ordersController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
// Wszystkie trasy wymagają autentykacji
router.use(authMiddleware_1.authMiddleware);
// Pobierz wszystkie zamówienia użytkownika z paginacją
router.get('/', ordersController_1.getUserOrders);
// Pobierz szczegóły konkretnego zamówienia
router.get('/:id', ordersController_1.getUserOrderById);
// Anuluj zamówienie
router.put('/:id/cancel', ordersController_1.cancelUserOrder);
exports.default = router;
