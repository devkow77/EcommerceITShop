import Stripe from 'stripe';
import { Request, Response } from 'express';

const stripeSecret = process.env.STRIPE_SECRET_KEY;
let stripe: Stripe | null = null;
if (stripeSecret) {
  stripe = new Stripe(stripeSecret);
} else {
  console.warn(
    'STRIPE_SECRET_KEY not set. Payment endpoint will return error until configured.',
  );
}

export const createPayment = async (req: Request, res: Response) => {
  try {
    if (!stripe) {
      return res.status(500).json({ error: 'Stripe not configured on server' });
    }

    // Accept either { cartDetails: {...} } or the raw cartDetails object in the body
    const cartDetails =
      req.body && req.body.cartDetails ? req.body.cartDetails : req.body;

    if (!cartDetails || Object.keys(cartDetails).length === 0) {
      return res.status(400).json({ error: 'Koszyk jest pusty' });
    }

    // Map cart details into Stripe line_items with validation
    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] =
      Object.values(cartDetails).map((item: any) => {
        const priceNum = Number(item.price);
        const quantity = Math.max(1, Number(item.quantity) || 1);

        if (isNaN(priceNum) || priceNum <= 0) {
          throw new Error(`Invalid price for item ${item.name || item.id}`);
        }

        // If price looks like złoty value (<100), convert to grosze
        const unit_amount = Math.round(
          priceNum < 100 ? priceNum * 100 : priceNum,
        );

        return {
          price_data: {
            currency: 'pln',
            product_data: {
              name: String(item.name || item.id),
              images: item.image ? [String(item.image)] : undefined,
            },
            unit_amount,
          },
          quantity,
        } as Stripe.Checkout.SessionCreateParams.LineItem;
      });

    const origin =
      (req.headers.origin as string) ||
      process.env.FRONTEND_URL ||
      'http://localhost:5173';

    // Debug logging (development only)
    if (process.env.NODE_ENV !== 'production') {
      console.log('Incoming payment request, origin:', origin);
      console.log('Line items:', JSON.stringify(line_items, null, 2));
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items,
      success_url: `${origin}/payment/success`,
      cancel_url: `${origin}/payment/cancel`,
    });

    res.json({ sessionUrl: session.url });
  } catch (error: any) {
    console.error('Stripe checkout error:', error?.message || error);
    const msg = error?.message || 'Unknown server error';
    res.status(500).json({ error: msg });
  }
};
