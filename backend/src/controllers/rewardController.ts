import prisma from '../prisma';
import { Request, Response } from 'express';

// Generuj losową nagrodę dla użytkownika
const generateReward = async (userId: number) => {
  try {
    // Pobierz losowy produkt (dostępny i na stanie)
    const randomProduct = await prisma.$queryRaw<{ id: number }[]>`
      SELECT id FROM "Product" 
      WHERE "isAvailable" = true AND "stock" > 0 
      ORDER BY RANDOM() 
      LIMIT 1
    `;

    if (!randomProduct || randomProduct.length === 0) {
      throw new Error('Brak dostępnych produktów do przydzielenia nagrody');
    }

    const productId = randomProduct[0].id;
    const discountPercent = Math.floor(Math.random() * (99 - 10 + 1)) + 10; // 10-99

    // Utwórz lub zaktualizuj nagrodę
    const reward = await prisma.userReward.upsert({
      where: { userId },
      update: {
        productId,
        discountPercent,
        generatedAt: new Date(),
      },
      create: {
        userId,
        productId,
        discountPercent,
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            price: true,
            imageUrl: true,
            category: {
              select: { name: true, slug: true },
            },
          },
        },
      },
    });

    return reward;
  } catch (error) {
    console.error('Błąd generowania nagrody:', error);
    throw error;
  }
};

// Pobierz nagrodę użytkownika
export const getUserReward = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Sprawdź czy użytkownik ma nagrodę
    const existingReward = await prisma.userReward.findUnique({
      where: { userId },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            price: true,
            imageUrl: true,
            description: true,
            category: {
              select: { name: true, slug: true },
            },
          },
        },
      },
    });

    // Jeśli nagrodę wygenerowano dziś, zwróć ją
    if (existingReward) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const rewardDate = new Date(existingReward.generatedAt);
      rewardDate.setHours(0, 0, 0, 0);

      if (rewardDate.getTime() === today.getTime()) {
        // Oblicz cenę po rabecie
        const discountedPrice = Math.round(
          existingReward.product.price *
            (1 - existingReward.discountPercent / 100),
        );

        return res.json({
          id: existingReward.id,
          product: existingReward.product,
          discount: existingReward.discountPercent,
          discountedPrice,
          generatedAt: existingReward.generatedAt,
        });
      }
    }

    // Wygeneruj nową nagrodę
    const newReward = await generateReward(userId);

    const discountedPrice = Math.round(
      newReward.product.price * (1 - newReward.discountPercent / 100),
    );

    return res.json({
      id: newReward.id,
      product: newReward.product,
      discount: newReward.discountPercent,
      discountedPrice,
      generatedAt: newReward.generatedAt,
    });
  } catch (error: any) {
    console.error('Błąd pobierania nagrody:', error);
    return res
      .status(500)
      .json({ error: error.message || 'Internal server error' });
  }
};

// Zresetuj nagrodę użytkownika (opcjonalnie)
export const resetUserReward = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    await prisma.userReward.delete({
      where: { userId },
    });

    // Wygeneruj nową nagrodę
    const newReward = await generateReward(userId);

    const discountedPrice = Math.round(
      newReward.product.price * (1 - newReward.discountPercent / 100),
    );

    return res.json({
      id: newReward.id,
      product: newReward.product,
      discount: newReward.discountPercent,
      discountedPrice,
      generatedAt: newReward.generatedAt,
    });
  } catch (error: any) {
    console.error('Błąd resetowania nagrody:', error);
    return res
      .status(500)
      .json({ error: error.message || 'Internal server error' });
  }
};
