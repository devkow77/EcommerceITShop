import Stripe from 'stripe';
import { Request, Response } from 'express';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export const createPayment = async (req: Request, res: Response) => {
  try {
    const { cartDetails } = req.body;

    if (!cartDetails || Object.keys(cartDetails).length === 0) {
      return res.status(400).json({ error: 'Koszyk jest pusty' });
    }

    const line_items = Object.values(cartDetails).map((item: any) => ({
      price_data: {
        currency: 'pln', // dostosuj do swojej waluty
        product_data: {
          name: item.name,
          images: [item.image],
        },
        unit_amount: item.price, // w groszach, np. 1999 = 19,99 PLN
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items,
      success_url: `${req.headers.origin}/success`,
      cancel_url: `${req.headers.origin}/cancel`,
    });

    res.json({ sessionUrl: session.url });
  } catch (error: any) {
    console.error('Stripe checkout error:', error);
    res.status(500).json({ error: error.message });
  }
};
