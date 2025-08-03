import { getServerSession } from 'next-auth';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-07-30.basil',
});

export async function POST(req: Request) {
  const { amount } = await req.json();

  const serverSession = await getServerSession();

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: { name: 'NextAI' },
          unit_amount: amount,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    customer_email: serverSession?.user?.email!,
    success_url: 'https://localhost:3000/payment',
    cancel_url: 'https://localhost:3000/payment',
  });

  return Response.json({ url: session.url });
}
