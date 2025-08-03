import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-07-30.basil',
});

const handler = async (req: NextRequest) => {
  switch (req.method) {
    case 'POST':
      try {
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

        return NextResponse.json({ url: session.url });
      } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to create Stripe session' }, { status: 500 });
      }

    default:
      return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
  }
};

export { handler as POST };
