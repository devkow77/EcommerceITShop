import { Router } from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
} from '../controllers/adminController';

const router = Router();

// Produkty
router.get('/products', getProducts);
router.get('/products/:id', getProductById);
router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

// Kategorie
router.get('/categories', getCategories);
router.get('/categories/:id', getCategoryById);
router.post('/categories', createCategory);
router.put('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);

// Uzytkownicy
router.get('/users', getUsers);
router.get('/users/:id', getUserById);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// Zamówienia
router.get('/orders', getOrders);
router.get('/orders/:id', getOrderById);
router.put('/orders/:id', updateOrder);
router.delete('/orders/:id', deleteOrder);

export default router;
