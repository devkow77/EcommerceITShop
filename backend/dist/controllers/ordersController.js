"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelUserOrder = exports.getUserOrderById = exports.getUserOrders = void 0;
const prisma_1 = __importDefault(require("../prisma"));
// Pobierz zamówienia aktualnego użytkownika
const getUserOrders = async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ msg: 'Brak autoryzacji' });
        }
        const { page = '1', limit = '10', sortBy = 'createdAt', order = 'desc', status, } = req.query;
        const pageNumber = Number(page);
        const limitNumber = Number(limit);
        const skip = (pageNumber - 1) * limitNumber;
        // 🔍 FILTRY
        const where = {
            userId,
            ...(status && { status: String(status) }),
        };
        // 📦 ZAPYTANIA
        const [orders, total] = await Promise.all([
            prisma_1.default.order.findMany({
                where,
                skip,
                take: limitNumber,
                orderBy: {
                    [String(sortBy)]: order === 'desc' ? 'desc' : 'asc',
                },
                include: {
                    items: {
                        include: {
                            product: {
                                select: {
                                    id: true,
                                    name: true,
                                    price: true,
                                    imageUrl: true,
                                    slug: true,
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
exports.getUserOrders = getUserOrders;
// Pobierz szczegóły konkretnego zamówienia użytkownika
const getUserOrderById = async (req, res) => {
    try {
        const userId = req.userId;
        const { id } = req.params;
        if (!userId) {
            return res.status(401).json({ msg: 'Brak autoryzacji' });
        }
        const order = await prisma_1.default.order.findUnique({
            where: { id: Number(id) },
            include: {
                items: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                price: true,
                                imageUrl: true,
                                slug: true,
                                description: true,
                            },
                        },
                    },
                },
            },
        });
        if (!order) {
            return res.status(404).json({ msg: 'Zamówienie nie istnieje' });
        }
        // Sprawdzić czy zamówienie należy do użytkownika
        if (order.userId !== userId) {
            return res.status(403).json({ msg: 'Brak dostępu do tego zamówienia' });
        }
        return res.status(200).json(order);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Błąd serwera' });
    }
};
exports.getUserOrderById = getUserOrderById;
// Anuluj zamówienie (tylko jeśli status to PENDING)
const cancelUserOrder = async (req, res) => {
    try {
        const userId = req.userId;
        const { id } = req.params;
        if (!userId) {
            return res.status(401).json({ msg: 'Brak autoryzacji' });
        }
        const order = await prisma_1.default.order.findUnique({
            where: { id: Number(id) },
        });
        if (!order) {
            return res.status(404).json({ msg: 'Zamówienie nie istnieje' });
        }
        if (order.userId !== userId) {
            return res.status(403).json({ msg: 'Brak dostępu do tego zamówienia' });
        }
        if (order.status !== 'PENDING') {
            return res.status(400).json({
                msg: 'Można anulować tylko zamówienia w stanie PENDING',
            });
        }
        const updatedOrder = await prisma_1.default.order.update({
            where: { id: Number(id) },
            data: { status: 'CANCELED' },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        });
        return res.status(200).json({
            msg: 'Zamówienie zostało anulowane',
            data: updatedOrder,
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Błąd serwera' });
    }
};
exports.cancelUserOrder = cancelUserOrder;
