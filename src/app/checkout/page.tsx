import CheckoutForm from '@/components/CheckoutForm/CheckoutForm';
import { cookies } from 'next/headers';
import Stripe from 'stripe';
import menuJson from '@/data/menu.json';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

const Checkout = async () => {
  const menuPrices = menuJson.prices;
  const tripPrices = menuJson.trips;
  const id = JSON.parse(cookies().get('session')?.value!);
  const data = await prisma.reservation.findUnique({
    where: { id },
    include: { addedItems: true },
  });

  // Check if reservation is valid
  if (!data?.totalPrice) throw Error('Reservation was not found');

  let totalPrice = data.totalPrice;

  // Check if the price is too small for stripe
  if (totalPrice < 10) throw Error('Something went wrong with pricing');

  // Create payment intent
  const paymentIntent = await stripe.paymentIntents.create({
    amount: totalPrice * 100, // smallest unit -> so * 100 - to get real value
    currency: 'NOK',
  });

  if (paymentIntent.client_secret == null) {
    throw Error('Stripe failed to create payment intent');
  }

  return (
    <CheckoutForm
      clientSecret={paymentIntent.client_secret}
      totalPrice={totalPrice}
      data={data}
    />
  );
};

export default Checkout;
