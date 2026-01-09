import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const body = await req.json();

    if (!body.items || body.items.length === 0) {
      throw new Error("No items provided.");
    }

    const session = await stripe.checkout.sessions.create({
      line_items: body.items.map(item => ({
        price_data: {
          currency: item.unitAmount.currencyCode,
          product_data: {
            name: item.name,
          },
          unit_amount: parseInt(item.unitAmount.value * 100, 10),
        },
        quantity: parseInt(item.quantity, 10),
      })),
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/pages/success/?success=true`,
      cancel_url: `${req.headers.get('origin')}/pages/failure/?canceled=true`,
      metadata: {
        firstName: body.customer.firstName,
        lastName: body.customer.lastName,
        email: body.customer.email,
        address: body.customer.address,
        city: body.customer.city,
        // Use JSON.stringify to save complex data if needed
        items: JSON.stringify(body.items.map(item => ({
          name: item.name,
          unitAmount: item.unitAmount,
          quantity: item.quantity,
        }))),
      },
      customer_email: body.customer.email // Directly associate customer email with the session
    });

    return new Response(JSON.stringify({ id: session.id }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (err) {
    console.error('Error creating checkout session:', err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: err.statusCode || 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
