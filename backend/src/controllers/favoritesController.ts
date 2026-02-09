import { Request, Response } from 'express';
import prisma from '../prisma';

export const getFavorites = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;

    const favorites = await prisma.userFavorite.findMany({
      where: { userId },
      include: {
        product: {
          include: {
            category: true,
            promotion: true,
            hotShot: true,
          },
        },
      },
    });

    res.json(favorites.map((fav: any) => fav.product));
  } catch (error: any) {
    console.error('Error fetching favorites:', error);
    res.status(500).json({ error: 'Failed to fetch favorites' });
  }
};

export const addFavorite = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ error: 'Product ID is required' });
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check if already in favorites
    const existing = await prisma.userFavorite.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    if (existing) {
      return res.status(400).json({ error: 'Product already in favorites' });
    }

    const favorite = await prisma.userFavorite.create({
      data: {
        userId,
        productId,
      },
      include: {
        product: {
          include: {
            category: true,
            promotion: true,
            hotShot: true,
          },
        },
      },
    });

    res.status(201).json(favorite.product);
  } catch (error: any) {
    console.error('Error adding favorite:', error);
    res.status(500).json({ error: 'Failed to add favorite' });
  }
};

export const removeFavorite = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({ error: 'Product ID is required' });
    }

    const favorite = await prisma.userFavorite.findUnique({
      where: {
        userId_productId: {
          userId,
          productId: parseInt(productId),
        },
      },
    });

    if (!favorite) {
      return res.status(404).json({ error: 'Product not in favorites' });
    }

    await prisma.userFavorite.delete({
      where: {
        userId_productId: {
          userId,
          productId: parseInt(productId),
        },
      },
    });

    res.json({ message: 'Favorite removed successfully' });
  } catch (error: any) {
    console.error('Error removing favorite:', error);
    res.status(500).json({ error: 'Failed to remove favorite' });
  }
};

export const checkFavorite = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({ error: 'Product ID is required' });
    }

    const favorite = await prisma.userFavorite.findUnique({
      where: {
        userId_productId: {
          userId,
          productId: parseInt(productId),
        },
      },
    });

    res.json({ isFavorite: !!favorite });
  } catch (error: any) {
    console.error('Error checking favorite:', error);
    res.status(500).json({ error: 'Failed to check favorite' });
  }
};
