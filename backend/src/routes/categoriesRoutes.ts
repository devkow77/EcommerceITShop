import { Router } from 'express';
import {
  getCategories,
  getCategoryProducts,
} from '../controllers/categoriesController';

const router = Router();

router.get('/', getCategories); // pobierz wszystkie kategorie
router.get('/:category/products', getCategoryProducts); // pobierz wszystkie produkty z jednej kategorii

export default router;
