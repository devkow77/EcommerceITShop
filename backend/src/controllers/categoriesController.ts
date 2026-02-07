import prisma from '../prisma';
import { Response, Request } from 'express';

// Pobierz wszystkie produkty z danej kategorii
export const getCategoryProducts = async (req: Request, res: Response) => {
  try {
    const { category } = req.params;

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20; // u Ciebie już działa
    const skip = (page - 1) * limit;

    const search = req.query.search?.toString();
    const minPrice = req.query.minPrice
      ? Number(req.query.minPrice)
      : undefined;
    const maxPrice = req.query.maxPrice
      ? Number(req.query.maxPrice)
      : undefined;

    const foundCategory = await prisma.category.findUnique({
      where: { slug: category },
    });

    if (!foundCategory) {
      return res.status(404).json({ message: 'Kategoria nie istnieje' });
    }

    const where: any = {
      categoryId: foundCategory.id,
      isAvailable: true,
      stock: { gt: 0 },
    };

    if (search) {
      where.name = {
        contains: search,
        mode: 'insensitive',
      };
    }

    if (minPrice || maxPrice) {
      where.price = {
        ...(minPrice ? { gte: minPrice } : {}),
        ...(maxPrice ? { lte: maxPrice } : {}),
      };
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { id: 'desc' },
        select: {
          id: true,
          name: true,
          slug: true,
          price: true,
          discount: true,
          imageUrl: true,
        },
      }),
      prisma.product.count({ where }),
    ]);

    const formatted = products.map((p) => ({
      ...p,
      discountedPrice: Math.round(p.price * (1 - (p.discount || 0) / 100)),
      discountPercent: p.discount || 0,
    }));

    res.json({
      products: formatted,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Błąd serwera' });
  }
};

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        slug: true, // slug do URL
      },
      orderBy: { name: 'asc' },
    });
    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Błąd pobierania kategorii' });
  }
};
