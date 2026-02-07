import { Router } from 'express';
import { getTodayPromotions } from '../controllers/productsController';

const router = Router();

router.get('/promotions', getTodayPromotions);

export default router;
