import { Router } from 'express';
import {
  getTodayPromotions,
  getProducts,
  getProduct,
  getProductsPreview,
} from '../controllers/productsController';

const router = Router();

router.get('/promotions', getTodayPromotions);
router.get('/preview', getProductsPreview);
router.get('/:slug', getProduct);
router.get('/', getProducts);

export default router;
