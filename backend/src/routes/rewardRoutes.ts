import { Router } from 'express';
import {
  getUserReward,
  resetUserReward,
} from '../controllers/rewardController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

// Ochrona wszystkich routów nagród autentykacją
router.use(authMiddleware);

// GET — Pobierz nagrodę użytkownika
router.get('/', getUserReward);

// POST — Zresetuj/wygeneruj nową nagrodę
router.post('/regenerate', resetUserReward);

export default router;
