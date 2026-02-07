"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminController_1 = require("../controllers/adminController");
const router = (0, express_1.Router)();
// Produkty
router.get('/products', adminController_1.getProducts);
router.get('/products/:id', adminController_1.getProductById);
router.post('/products', adminController_1.createProduct);
router.put('/products/:id', adminController_1.updateProduct);
router.delete('/products/:id', adminController_1.deleteProduct);
// Kategorie
router.get('/categories', adminController_1.getCategories);
router.get('/categories/:id', adminController_1.getCategoryById);
router.post('/categories', adminController_1.createCategory);
router.put('/categories/:id', adminController_1.updateCategory);
router.delete('/categories/:id', adminController_1.deleteCategory);
// Uzytkownicy
router.get('/users', adminController_1.getUsers);
router.get('/users/:id', adminController_1.getUserById);
router.post('/users', adminController_1.createUser);
router.put('/users/:id', adminController_1.updateUser);
router.delete('/users/:id', adminController_1.deleteUser);
// Zamówienia
router.get('/orders', adminController_1.getOrders);
router.get('/orders/:id', adminController_1.getOrderById);
router.put('/orders/:id', adminController_1.updateOrder);
router.delete('/orders/:id', adminController_1.deleteOrder);
exports.default = router;
