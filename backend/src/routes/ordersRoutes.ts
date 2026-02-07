import { Router } from 'express';
import {
  getUserOrders,
  getUserOrderById,
  cancelUserOrder,
} from '../controllers/ordersController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

// Wszystkie trasy wymagają autentykacji
router.use(authMiddleware);

// Pobierz wszystkie zamówienia użytkownika z paginacją
router.get('/', getUserOrders);

// Pobierz szczegóły konkretnego zamówienia
router.get('/:id', getUserOrderById);

// Anuluj zamówienie
router.put('/:id/cancel', cancelUserOrder);

export default router;
