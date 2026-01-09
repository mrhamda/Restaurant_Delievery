import Stripe from 'stripe';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const prisma = new PrismaClient();

export async function POST(req) {
  const sig = req.headers.get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  let event;

  try {
    const body = await req.text(); 
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return new Response('Webhook Error', { status: 400 });
  }

  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      const parsedItems = JSON.parse(session.metadata.items);
      const order = await prisma.order.create({
        data: {
          firstName: session.metadata.firstName,
          lastName: session.metadata.lastName,
          email: session.metadata.email, 
          address: session.metadata.address,
          city: session.metadata.city,
          items: {
            create: parsedItems.map(item => ({
              product: item.name,  
              quantity: parseInt(item.quantity),
              price: parseFloat(item.unitAmount.value), 
            })),
          },
        },
      });
     


      break;

    default:
      console.warn(`Unhandled event type: ${event.type}`);
  }


  return new Response('Received', { status: 200 });
}
