import prisma from '../prisma';
import { Response, Request } from 'express';

const PROMO_DISCOUNT = 10; // stały rabat 10%

export const randomPromotions = async () => {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    // 1. Sprawdzamy, czy są już promocje dzisiaj
    const existingPromos = await prisma.promotion.findFirst({
      where: {
        createdAt: {
          gte: todayStart,
          lte: todayEnd,
        },
      },
    });

    if (existingPromos) {
      console.log('Promocje na dzisiaj zostały już wylosowane.');
      return; // nic nie robimy
    }

    // 2. Pobieramy wszystkie produkty
    const allProducts = await prisma.product.findMany({
      select: { id: true, price: true },
    });

    // 3. Tasujemy i wybieramy 5 produktów
    const shuffled = allProducts.sort(() => 0.5 - Math.random()).slice(0, 5);

    // 4. Resetujemy poprzednie promocje w tabeli produktów
    await prisma.product.updateMany({
      data: {
        discount: null,
        discountedPrice: null,
      },
    });

    // 5. Aktualizujemy wybrane produkty z rabatem
    const updatePromises = shuffled.map((p) =>
      prisma.product.update({
        where: { id: p.id },
        data: {
          discount: PROMO_DISCOUNT,
          discountedPrice: Math.floor(p.price * (1 - PROMO_DISCOUNT / 100)),
        },
      }),
    );

    await Promise.all(updatePromises);

    // 6. Tworzymy wpisy w tabeli Promotion
    const promotionPromises = shuffled.map((p) =>
      prisma.promotion.create({
        data: {
          productId: p.id,
          discount: PROMO_DISCOUNT,
        },
      }),
    );

    await Promise.all(promotionPromises);

    console.log('Nowe promocje zostały wylosowane i zapisane.');
  } catch (error) {
    console.error('Błąd przy aktualizacji promocji:', error);
  }
};

export const getTodayPromotions = async (req: Request, res: Response) => {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  try {
    // pobieramy produkty tylko z promocją dzisiaj
    const products = await prisma.product.findMany({
      where: {
        promotion: {
          some: {
            createdAt: {
              gte: todayStart,
              lte: todayEnd,
            },
          },
        },
      },
      select: {
        id: true,
        name: true,
        price: true,
        discountedPrice: true,
        discount: true,
      },
    });

    return res.json(products);
  } catch (error) {
    console.error('Błąd przy pobieraniu promocji:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
