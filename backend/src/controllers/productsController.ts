import prisma from '../prisma';
import { Response, Request } from 'express';

export const handleDailyPromotions = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 1. Sprawdź czy są promocje z dzisiaj
  const currentPromotions = await prisma.promotion.findFirst({
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
  await prisma.promotion.deleteMany({});

  // 3. Pobierz 5 losowych ID produktów (używając surowego zapytania dla wydajności)
  // W PostgreSQL 'ORDER BY RANDOM()' działa świetnie dla małych/średnich baz
  const randomProducts = await prisma.$queryRaw<{ id: number }[]>`
    SELECT id FROM "Product" 
    WHERE "isAvailable" = true AND "stock" > 0 
    ORDER BY RANDOM() 
    LIMIT 5
  `;

  // 4. Zapisz nowe promocje
  const promotionData = randomProducts.map((p) => ({ productId: p.id }));
  await prisma.promotion.createMany({
    data: promotionData,
  });

  console.log('Nowe promocje zostały zapisane.');
};

export const getTodayPromotions = async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
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
  } catch (error) {
    console.error('Błąd przy pobieraniu promocji:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
