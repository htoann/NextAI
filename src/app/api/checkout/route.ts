import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-07-30.basil',
});

export const POST = async (req: NextRequest): Promise<NextResponse> => {
  try {
    const { amount } = await req.json();
    const sessionData = await getServerSession();

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
      customer_email: sessionData?.user?.email!,
      success_url: 'https://localhost:3000/payment',
      cancel_url: 'https://localhost:3000/payment',
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('Stripe checkout error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
};
