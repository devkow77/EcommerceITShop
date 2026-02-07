import prisma from '../prisma';
import { Response, Request } from 'express';

// wygeneruj codzienne promocje
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

// Pobierz codzienne promocje
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

// Pobierz wszystkie produkty
export const getProducts = async (req: Request, res: Response) => {
  try {
    // Pobierz wszystkie kategorie i ich produkty (tylko dostępne i na stanie)
    const categories = await prisma.category.findMany({
      include: {
        products: {
          where: { isAvailable: true, stock: { gt: 0 } },
          select: {
            id: true,
            name: true,
            slug: true,
            price: true,
            discount: true,
            imageUrl: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });

    // Dodaj obliczoną cenę po rabacie i procent rabatu
    const formatted = categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      products: cat.products.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        price: p.price,
        discountedPrice: Math.round(p.price * (1 - (p.discount || 0) / 100)),
        discountPercent: p.discount || 0,
        imageUrl: p.imageUrl,
      })),
    }));

    return res.status(200).json(formatted);
  } catch (err) {
    console.error('Błąd pobierania kategorii z produktami:', err);
    return res.status(500).json({ message: 'Błąd serwera' });
  }
};

// Pobierz preview produktów (max 8 na kategorię)
export const getProductsPreview = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        products: {
          where: {
            isAvailable: true,
            stock: { gt: 0 },
          },
          take: 8,
          orderBy: {
            id: 'desc',
          },
          select: {
            id: true,
            name: true,
            slug: true,
            price: true,
            discount: true,
            imageUrl: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });

    const formatted = categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      products: cat.products.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        price: p.price,
        discountedPrice: Math.round(p.price * (1 - (p.discount || 0) / 100)),
        discount: p.discount || 0,
        imageUrl: p.imageUrl,
      })),
    }));

    return res.status(200).json(formatted);
  } catch (err) {
    console.error('Błąd pobierania preview produktów:', err);
    return res.status(500).json({ message: 'Błąd serwera' });
  }
};

// Pobierz pojedynczy produkt i wszystkie informacje
export const getProduct = async (req: Request, res: Response) => {
  const { slug } = req.params;

  try {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: true, // żeby mieć info o kategorii
      },
    });

    if (!product) {
      return res.status(404).json({ message: 'Produkt nie znaleziony' });
    }

    res.json({
      id: product.id,
      name: product.name,
      price: product.price,
      discount: product.discount,
      discountedPrice: Math.round(product.price * (1 - product.discount / 100)),
      description: product.description,
      stock: product.stock,
      imageUrl: product.imageUrl,
      category: {
        id: product.category.id,
        name: product.category.name,
        slug: product.category.slug,
      },
    });
  } catch (err) {
    console.error('Błąd pobierania produktu:', err);
    res.status(500).json({ message: 'Błąd serwera' });
  }
};
