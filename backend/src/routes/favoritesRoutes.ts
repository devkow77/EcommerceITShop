import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import {
  getFavorites,
  addFavorite,
  removeFavorite,
  checkFavorite,
} from '../controllers/favoritesController';

const router = Router();

// All routes require authentication
router.get('/', authMiddleware, getFavorites);
router.post('/', authMiddleware, addFavorite);
router.delete('/:productId', authMiddleware, removeFavorite);
router.get('/check/:productId', authMiddleware, checkFavorite);

export default router;
