import { Request, Response } from 'express';
import prisma from '../prisma';

// Pobierz zamówienia aktualnego użytkownika
export const getUserOrders = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;

    if (!userId) {
      return res.status(401).json({ msg: 'Brak autoryzacji' });
    }

    const {
      page = '1',
      limit = '10',
      sortBy = 'id',
      order = 'desc',
      status,
    } = req.query;

    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;

    //  FILTRY
    const where: any = {
      userId,
      ...(status && { status: String(status) }),
    };

    // Bezpieczne sortowanie - whitelist pól dostępnych w modelu
    const allowedSortFields = [
      'id',
      'userId',
      'totalAmount',
      'stripeSession',
      'status',
    ];
    const sortField = allowedSortFields.includes(String(sortBy))
      ? String(sortBy)
      : 'id';

    // ZAPYTANIA
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: limitNumber,
        orderBy: {
          [sortField]: order === 'desc' ? 'desc' : 'asc',
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
    console.error('getUserOrders error:', err);
    const message = err instanceof Error ? err.message : String(err);
    res.status(500).json({ msg: 'Błąd serwera', error: message });
  }
};

// Pobierz szczegóły konkretnego zamówienia użytkownika
export const getUserOrderById = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({ msg: 'Brak autoryzacji' });
    }
    console.log('getUserOrderById - userId:', userId, 'id:', id);

    const order = await prisma.order.findUnique({
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
  } catch (err) {
    console.error('getUserOrderById error:', err);
    const message = err instanceof Error ? err.message : String(err);
    res.status(500).json({ msg: 'Błąd serwera', error: message });
  }
};

// Anuluj zamówienie (tylko jeśli status to PENDING)
export const cancelUserOrder = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({ msg: 'Brak autoryzacji' });
    }
    console.log('cancelUserOrder - userId:', userId, 'id:', id);

    const order = await prisma.order.findUnique({
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

    const updatedOrder = await prisma.order.update({
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
  } catch (err) {
    console.error('cancelUserOrder error:', err);
    const message = err instanceof Error ? err.message : String(err);
    res.status(500).json({ msg: 'Błąd serwera', error: message });
  }
};
