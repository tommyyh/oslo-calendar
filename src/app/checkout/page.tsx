import CheckoutForm from '@/components/CheckoutForm/CheckoutForm';
import { cookies } from 'next/headers';
import Stripe from 'stripe';
import menuJson from '@/data/menu.json';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

const Checkout = async () => {
  const menuPrices = menuJson.prices;
  const tripPrices = menuJson.trips;
  const data = JSON.parse(cookies().get('session')?.value!);
  let totalPrice = 0;

  const calculatePrice = () => {
    data.addedItems.forEach((item: any) => {
      const foundItem = menuPrices.find(
        (menuItem) => menuItem.title === item.title
      );

      if (foundItem) {
        // Found the item, now calculate the price based on quantity
        totalPrice += parseInt(foundItem.price) * item.quantity;
      } else {
        console.log(`Item not found`);
      }
    });

    // Add trip price
    const foundTrip = tripPrices.find(
      (trip) => trip.title === data.destination
    );

    if (foundTrip) {
      const tripPrice = parseInt(foundTrip.price);

      totalPrice += tripPrice;
    } else {
      console.log(`Trip not found`);
    }
  };

  calculatePrice();

  // Payment
  if (totalPrice < 10) return;

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
