import { Router } from 'express';
import {
  randomPromotions, getTodayPromotions
} from '../controllers/productsController';

const router = Router();

router.get('/generate', randomPromotions);
router.get('/promotions', getTodayPromotions);


export default router;
