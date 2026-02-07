import { Request, Response } from 'express';
import prisma from '../prisma';
import bcrypt from 'bcrypt';

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

export const getCategories = async (req: Request, res: Response) => {
  try {
    const {
      page = '1',
      limit = '10',
      sortBy = 'id',
      order = 'asc',
      search,
    } = req.query;

    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;

    const where: any = {
      ...(search && {
        OR: [
          { name: { contains: String(search), mode: 'insensitive' } },
          { slug: { contains: String(search), mode: 'insensitive' } },
        ],
      }),
    };

    const [categories, total] = await Promise.all([
      prisma.category.findMany({
        where,
        skip,
        take: limitNumber,
        orderBy: {
          [String(sortBy)]: order === 'desc' ? 'desc' : 'asc',
        },
      }),
      prisma.category.count({ where }),
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
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Błąd serwera' });
  }
};

export const getCategoryById = async (req: Request, res: Response) => {
  const { id } = req.params;

  const category = await prisma.category.findUnique({
    where: { id: Number(id) },
    include: { products: true },
  });

  if (!category)
    return res.status(404).json({ message: 'Kategoria nie istnieje' });

  return res.status(200).json(category);
};

export const createCategory = async (req: Request, res: Response) => {
  const { name, slug } = req.body;

  try {
    const category = await prisma.category.create({ data: { name, slug } });
    return res.status(201).json(category);
  } catch (err: any) {
    console.error(err);
    return res.status(400).json({ message: err.message });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, slug } = req.body;

  try {
    const category = await prisma.category.update({
      where: { id: Number(id) },
      data: { name, slug },
    });

    return res.status(200).json(category);
  } catch (err: any) {
    console.error(err);
    return res.status(400).json({ message: err.message });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  // Jeśli kategoria ma produkty, zabroń usunięcia
  const productsCount = await prisma.product.count({
    where: { categoryId: id },
  });
  if (productsCount > 0) {
    return res.status(400).json({
      message:
        'Kategoria posiada produkty. Usuń lub przenieś produkty przed usunięciem.',
    });
  }

  await prisma.category.delete({ where: { id } });
  return res.status(204).send();
};

// Pobierz wszystkich użytkowników z opcjonalnymi filtrami, sortowaniem i paginacją
export const getUsers = async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const sortBy = (req.query.sortBy as string) || 'id';
  const order = req.query.order === 'desc' ? 'desc' : 'asc';
  const search = req.query.search as string | undefined;

  const where: any = search
    ? {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
        ],
      }
    : {};

  const [users, total] = await Promise.all([
    prisma.user.findMany({
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
    prisma.user.count({ where }),
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

// Pobierz szczegóły użytkownika po ID
export const getUserById = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  const user = await prisma.user.findUnique({
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

// Tworzenie nowego użytkownika
export const createUser = async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
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

// Aktualizacja użytkownika
export const updateUser = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { name, email, password, role } = req.body;

  const data: any = {
    name,
    email,
    role,
  };

  if (password) {
    data.password = await bcrypt.hash(password, 10);
  }

  const user = await prisma.user.update({
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

// Usun użytkownika wraz z jego zamówieniami i pozycjami zamówień
export const deleteUser = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  await prisma.$transaction([
    prisma.orderItem.deleteMany({
      where: { order: { userId: id } },
    }),
    prisma.order.deleteMany({
      where: { userId: id },
    }),
    prisma.user.delete({
      where: { id },
    }),
  ]);

  res.status(204).send();
};

// Pobierz wszystkie zamówienia z opcjonalnymi filtrami, sortowaniem i paginacją
export const getOrders = async (req: Request, res: Response) => {
  try {
    const {
      page = '1',
      limit = '10',
      sortBy = 'id',
      order = 'asc',
      search,
      status,
      userId,
      minAmount,
      maxAmount,
    } = req.query;

    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;

    // 🔍 FILTRY
    const where: any = {
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
      prisma.order.findMany({
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
      prisma.order.count({ where }),
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
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Błąd serwera' });
  }
};

// Pobierz szczegóły zamówienia po ID
export const getOrderById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const order = await prisma.order.findUnique({
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
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Błąd serwera' });
  }
};

// Aktualizacja zamówienia (głównie status)
export const updateOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, totalAmount } = req.body;

    const order = await prisma.order.update({
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
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Błąd serwera' });
  }
};

// Usuwanie zamówienia
export const deleteOrder = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    await prisma.$transaction([
      prisma.orderItem.deleteMany({
        where: { orderId: id },
      }),
      prisma.order.delete({
        where: { id },
      }),
    ]);

    return res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Błąd serwera' });
  }
};
