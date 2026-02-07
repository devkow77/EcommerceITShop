"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOrder = exports.updateOrder = exports.getOrderById = exports.getOrders = exports.deleteUser = exports.updateUser = exports.createUser = exports.getUserById = exports.getUsers = exports.deleteCategory = exports.updateCategory = exports.createCategory = exports.getCategoryById = exports.getCategories = exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProductById = exports.getProducts = void 0;
const prisma_1 = __importDefault(require("../prisma"));
const bcrypt_1 = __importDefault(require("bcrypt"));
// Pobierz wszystkie prosdukty z opcjonalnymi filtrami, sortowaniem i paginacja
const getProducts = async (req, res) => {
    try {
        const { page = '1', limit = '10', sortBy = 'id', order = 'asc', search, minPrice, maxPrice, inStock, } = req.query;
        const pageNumber = Number(page);
        const limitNumber = Number(limit);
        const skip = (pageNumber - 1) * limitNumber;
        // 🔍 FILTRY
        const where = {
            ...(search && {
                OR: [
                    { name: { contains: String(search), mode: 'insensitive' } },
                    { slug: { contains: String(search), mode: 'insensitive' } },
                ],
            }),
            ...(minPrice || maxPrice
                ? {
                    price: {
                        ...(minPrice && { gte: Number(minPrice) }),
                        ...(maxPrice && { lte: Number(maxPrice) }),
                    },
                }
                : {}),
            ...(inStock === 'true' && { stock: { gt: 0 } }),
        };
        // 📦 ZAPYTANIA
        const [products, total] = await Promise.all([
            prisma_1.default.product.findMany({
                where,
                skip,
                take: limitNumber,
                orderBy: {
                    [String(sortBy)]: order === 'desc' ? 'desc' : 'asc',
                },
            }),
            prisma_1.default.product.count({ where }),
        ]);
        res.json({
            data: products,
            meta: {
                page: pageNumber,
                limit: limitNumber,
                total,
                totalPages: Math.ceil(total / limitNumber),
            },
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Błąd serwera' });
    }
};
exports.getProducts = getProducts;
// Pobierz szczegóły produktu po ID
const getProductById = async (req, res) => {
    const { id } = req.params;
    const product = await prisma_1.default.product.findUnique({
        where: { id: Number(id) },
        include: { category: true },
    });
    if (!product) {
        return res.status(404).json({ message: 'Produkt nie istnieje' });
    }
    return res.status(200).json(product);
};
exports.getProductById = getProductById;
// Tworzenie nowego produktu
const createProduct = async (req, res) => {
    const { name, slug, price, description, discount, imageUrl, stock, categoryId, } = req.body;
    const product = await prisma_1.default.product.create({
        data: {
            name,
            slug,
            price,
            description,
            discount,
            imageUrl,
            stock,
            categoryId,
        },
    });
    res.status(201).json(product);
};
exports.createProduct = createProduct;
// Aktualizacja produktu
const updateProduct = async (req, res) => {
    const { id } = req.params;
    const product = await prisma_1.default.product.update({
        where: { id: Number(id) },
        data: {
            name: req.body.name,
            slug: req.body.slug,
            price: req.body.price,
            description: req.body.description,
            discount: req.body.discount,
            imageUrl: req.body.imageUrl,
            stock: req.body.stock,
            isAvailable: req.body.isAvailable,
            category: {
                connect: { id: Number(req.body.categoryId) },
            },
        },
    });
    return res.status(200).json(product);
};
exports.updateProduct = updateProduct;
// Usuwanie produktu
const deleteProduct = async (req, res) => {
    const id = Number(req.params.id);
    await prisma_1.default.$transaction([
        prisma_1.default.promotion.deleteMany({
            where: { productId: id },
        }),
        prisma_1.default.orderItem.deleteMany({
            where: { productId: id },
        }),
        prisma_1.default.product.delete({
            where: { id },
        }),
    ]);
    return res.status(204).send();
};
exports.deleteProduct = deleteProduct;
// Pobierz wszystkie kategorie
const getCategories = async (req, res) => {
    try {
        const { page = '1', limit = '10', sortBy = 'id', order = 'asc', search, } = req.query;
        const pageNumber = Number(page);
        const limitNumber = Number(limit);
        const skip = (pageNumber - 1) * limitNumber;
        const where = {
            ...(search && {
                OR: [
                    { name: { contains: String(search), mode: 'insensitive' } },
                    { slug: { contains: String(search), mode: 'insensitive' } },
                ],
            }),
        };
        const [categories, total] = await Promise.all([
            prisma_1.default.category.findMany({
                where,
                skip,
                take: limitNumber,
                orderBy: {
                    [String(sortBy)]: order === 'desc' ? 'desc' : 'asc',
                },
            }),
            prisma_1.default.category.count({ where }),
        ]);
        res.json({
            data: categories,
            meta: {
                page: pageNumber,
                limit: limitNumber,
                total,
                totalPages: Math.ceil(total / limitNumber),
            },
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Błąd serwera' });
    }
};
exports.getCategories = getCategories;
// Pobierz szczegóły kategorii
const getCategoryById = async (req, res) => {
    const { id } = req.params;
    const category = await prisma_1.default.category.findUnique({
        where: { id: Number(id) },
        include: { products: true },
    });
    if (!category)
        return res.status(404).json({ message: 'Kategoria nie istnieje' });
    return res.status(200).json(category);
};
exports.getCategoryById = getCategoryById;
// Tworzenie nowej kategorii
const createCategory = async (req, res) => {
    const { name, slug } = req.body;
    try {
        const category = await prisma_1.default.category.create({ data: { name, slug } });
        return res.status(201).json(category);
    }
    catch (err) {
        console.error(err);
        return res.status(400).json({ message: err.message });
    }
};
exports.createCategory = createCategory;
// Aktualizacja kategorii
const updateCategory = async (req, res) => {
    const { id } = req.params;
    const { name, slug } = req.body;
    try {
        const category = await prisma_1.default.category.update({
            where: { id: Number(id) },
            data: { name, slug },
        });
        return res.status(200).json(category);
    }
    catch (err) {
        console.error(err);
        return res.status(400).json({ message: err.message });
    }
};
exports.updateCategory = updateCategory;
// Usuwanie kategorii
const deleteCategory = async (req, res) => {
    const id = Number(req.params.id);
    // Jeśli kategoria ma produkty, zabroń usunięcia
    const productsCount = await prisma_1.default.product.count({
        where: { categoryId: id },
    });
    if (productsCount > 0) {
        return res.status(400).json({
            message: 'Kategoria posiada produkty. Usuń lub przenieś produkty przed usunięciem.',
        });
    }
    await prisma_1.default.category.delete({ where: { id } });
    return res.status(204).send();
};
exports.deleteCategory = deleteCategory;
// Pobierz wszystkich użytkowników z opcjonalnymi filtrami, sortowaniem i paginacją
const getUsers = async (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const sortBy = req.query.sortBy || 'id';
    const order = req.query.order === 'desc' ? 'desc' : 'asc';
    const search = req.query.search;
    const where = search
        ? {
            OR: [
                { name: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
            ],
        }
        : {};
    const [users, total] = await Promise.all([
        prisma_1.default.user.findMany({
            where,
            skip,
            take: limit,
            orderBy: { [sortBy]: order },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
            },
        }),
        prisma_1.default.user.count({ where }),
    ]);
    res.json({
        data: users,
        meta: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    });
};
exports.getUsers = getUsers;
// Pobierz szczegóły użytkownika po ID
const getUserById = async (req, res) => {
    const id = Number(req.params.id);
    const user = await prisma_1.default.user.findUnique({
        where: { id },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
            orders: true,
        },
    });
    if (!user) {
        return res.status(404).json({ message: 'Użytkownik nie istnieje' });
    }
    res.json(user);
};
exports.getUserById = getUserById;
// Tworzenie nowego użytkownika
const createUser = async (req, res) => {
    const { name, email, password, role } = req.body;
    const hashedPassword = await bcrypt_1.default.hash(password, 10);
    const user = await prisma_1.default.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            role,
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
        },
    });
    res.status(201).json(user);
};
exports.createUser = createUser;
// Aktualizacja użytkownika
const updateUser = async (req, res) => {
    const id = Number(req.params.id);
    const { name, email, password, role } = req.body;
    const data = {
        name,
        email,
        role,
    };
    if (password) {
        data.password = await bcrypt_1.default.hash(password, 10);
    }
    const user = await prisma_1.default.user.update({
        where: { id },
        data,
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
        },
    });
    res.json(user);
};
exports.updateUser = updateUser;
// Usun użytkownika wraz z jego zamówieniami i pozycjami zamówień
const deleteUser = async (req, res) => {
    const id = Number(req.params.id);
    await prisma_1.default.$transaction([
        prisma_1.default.orderItem.deleteMany({
            where: { order: { userId: id } },
        }),
        prisma_1.default.order.deleteMany({
            where: { userId: id },
        }),
        prisma_1.default.user.delete({
            where: { id },
        }),
    ]);
    res.status(204).send();
};
exports.deleteUser = deleteUser;
// Pobierz wszystkie zamówienia z opcjonalnymi filtrami, sortowaniem i paginacją
const getOrders = async (req, res) => {
    try {
        const { page = '1', limit = '10', sortBy = 'id', order = 'asc', search, status, userId, minAmount, maxAmount, } = req.query;
        const pageNumber = Number(page);
        const limitNumber = Number(limit);
        const skip = (pageNumber - 1) * limitNumber;
        // 🔍 FILTRY
        const where = {
            ...(search && {
                user: {
                    OR: [
                        { name: { contains: String(search), mode: 'insensitive' } },
                        { email: { contains: String(search), mode: 'insensitive' } },
                    ],
                },
            }),
            ...(status && { status: String(status) }),
            ...(userId && { userId: Number(userId) }),
            ...(minAmount || maxAmount
                ? {
                    totalAmount: {
                        ...(minAmount && { gte: Number(minAmount) }),
                        ...(maxAmount && { lte: Number(maxAmount) }),
                    },
                }
                : {}),
        };
        // ZAPYTANIA
        const [orders, total] = await Promise.all([
            prisma_1.default.order.findMany({
                where,
                skip,
                take: limitNumber,
                orderBy: {
                    [String(sortBy)]: order === 'desc' ? 'desc' : 'asc',
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                    items: {
                        include: {
                            product: {
                                select: {
                                    id: true,
                                    name: true,
                                    price: true,
                                },
                            },
                        },
                    },
                },
            }),
            prisma_1.default.order.count({ where }),
        ]);
        res.json({
            data: orders,
            meta: {
                page: pageNumber,
                limit: limitNumber,
                total,
                totalPages: Math.ceil(total / limitNumber),
            },
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Błąd serwera' });
    }
};
exports.getOrders = getOrders;
// Pobierz szczegóły zamówienia po ID
const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await prisma_1.default.order.findUnique({
            where: { id: Number(id) },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        createdAt: true,
                    },
                },
                items: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                price: true,
                                imageUrl: true,
                            },
                        },
                    },
                },
            },
        });
        if (!order) {
            return res.status(404).json({ message: 'Zamówienie nie istnieje' });
        }
        return res.status(200).json(order);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Błąd serwera' });
    }
};
exports.getOrderById = getOrderById;
// Aktualizacja zamówienia (głównie status)
const updateOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, totalAmount } = req.body;
        const order = await prisma_1.default.order.update({
            where: { id: Number(id) },
            data: {
                ...(status && { status }),
                ...(totalAmount && { totalAmount: Number(totalAmount) }),
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                items: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                price: true,
                            },
                        },
                    },
                },
            },
        });
        return res.status(200).json(order);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Błąd serwera' });
    }
};
exports.updateOrder = updateOrder;
// Usuwanie zamówienia
const deleteOrder = async (req, res) => {
    try {
        const id = Number(req.params.id);
        await prisma_1.default.$transaction([
            prisma_1.default.orderItem.deleteMany({
                where: { orderId: id },
            }),
            prisma_1.default.order.delete({
                where: { id },
            }),
        ]);
        return res.status(204).send();
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Błąd serwera' });
    }
};
exports.deleteOrder = deleteOrder;
