"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTodayPromotions = exports.handleDailyPromotions = void 0;
const prisma_1 = __importDefault(require("../prisma"));
const handleDailyPromotions = async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    // 1. Sprawdź czy są promocje z dzisiaj
    const currentPromotions = await prisma_1.default.promotion.findFirst({
        where: {
            createdAt: { gte: today },
        },
    });
    if (currentPromotions) {
        console.log('Promocje na dziś są już wylosowane.');
        return;
    }
    console.log('Losowanie nowych promocji...');
    // 2. Wyczyść starą tabelę promocji
    await prisma_1.default.promotion.deleteMany({});
    // 3. Pobierz 5 losowych ID produktów (używając surowego zapytania dla wydajności)
    // W PostgreSQL 'ORDER BY RANDOM()' działa świetnie dla małych/średnich baz
    const randomProducts = await prisma_1.default.$queryRaw `
    SELECT id FROM "Product" 
    WHERE "isAvailable" = true AND "stock" > 0 
    ORDER BY RANDOM() 
    LIMIT 5
  `;
    // 4. Zapisz nowe promocje
    const promotionData = randomProducts.map((p) => ({ productId: p.id }));
    await prisma_1.default.promotion.createMany({
        data: promotionData,
    });
    console.log('Nowe promocje zostały zapisane.');
};
exports.handleDailyPromotions = handleDailyPromotions;
const getTodayPromotions = async (req, res) => {
    try {
        const products = await prisma_1.default.product.findMany({
            where: {
                promotion: {
                    some: {},
                },
            },
            select: {
                id: true,
                name: true,
                price: true,
                slug: true,
                imageUrl: true,
                category: {
                    select: { name: true },
                },
            },
            take: 5,
        });
        const promotionsWithCalculatedPrice = products.map((product) => ({
            ...product,
            discountPercent: 10,
            discountedPrice: Math.round(product.price * 0.9),
        }));
        return res.json(promotionsWithCalculatedPrice);
    }
    catch (error) {
        console.error('Błąd przy pobieraniu promocji:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getTodayPromotions = getTodayPromotions;
