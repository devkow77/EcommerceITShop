import { Request, Response } from 'express';
import prisma from '../prisma';

// Pobierz wszystkie prosdukty z opcjonalnymi filtrami, sortowaniem i paginacja
export const getProducts = async (req: Request, res: Response) => {
  try {
    const {
      page = '1',
      limit = '10',
      sortBy = 'id',
      order = 'asc',
      search,
      minPrice,
      maxPrice,
      inStock,
    } = req.query;

    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;

    // 🔍 FILTRY
    const where: any = {
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
      prisma.product.findMany({
        where,
        skip,
        take: limitNumber,
        orderBy: {
          [String(sortBy)]: order === 'desc' ? 'desc' : 'asc',
        },
      }),
      prisma.product.count({ where }),
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
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Błąd serwera' });
  }
};

// Pobierz szczegóły produktu po ID
export const getProductById = async (req: Request, res: Response) => {
  const { id } = req.params;

  const product = await prisma.product.findUnique({
    where: { id: Number(id) },
    include: { category: true },
  });

  if (!product) {
    return res.status(404).json({ message: 'Produkt nie istnieje' });
  }

  return res.status(200).json(product);
};

// Tworzenie nowego produktu
export const createProduct = async (req: Request, res: Response) => {
  const {
    name,
    slug,
    price,
    description,
    discount,
    imageUrl,
    stock,
    categoryId,
  } = req.body;

  const product = await prisma.product.create({
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

// Aktualizacja produktu
export const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params;

  const product = await prisma.product.update({
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

// Usuwanie produktu
export const deleteProduct = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  await prisma.$transaction([
    prisma.promotion.deleteMany({
      where: { productId: id },
    }),
    prisma.orderItem.deleteMany({
      where: { productId: id },
    }),
    prisma.product.delete({
      where: { id },
    }),
  ]);

  return res.status(204).send();
};
