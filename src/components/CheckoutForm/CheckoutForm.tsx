'use client';

import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import React, { FormEvent, useState } from 'react';
import Nav from '../Nav/Nav';
import style from './checkoutForm.module.scss';
import OrderSummary from '../OrderSummary/OrderSummary';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type CheckoutFormProps = {
  clientSecret: string;
  totalPrice: number;
  data: any;
};

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string
);

const CheckoutForm = ({
  clientSecret,
  totalPrice,
  data,
}: CheckoutFormProps) => {
  return (
    <div className={style.main}>
      <Nav formStage={4} />

      <div className={style.right}>
        <a href={'/'} className={style.goBack}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
            <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z" />
          </svg>
          Gå Tilbake
        </a>

        <OrderSummary data={data} totalPrice={totalPrice} />

        <Elements options={{ clientSecret }} stripe={stripePromise}>
          <Form totalPrice={totalPrice} data={data} />
        </Elements>
      </div>
    </div>
  );
};

const Form = ({ totalPrice, data }: any) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const stripe = useStripe();
  const { push } = useRouter();
  const elements = useElements();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (stripe == null || elements == null) return;

    setLoading(true);

    // Confirm payment
    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/checkout/success`,
          receipt_email: data.email,
        },
        redirect: 'if_required',
      });

      if (error?.type === 'card_error' || error?.type === 'validation_error') {
        setError(error.message);
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        // SUCCESS
        try {
          const res: any = await fetch('/api/save', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          });

          const resData = await res.json();

          // Handle response
          if (resData.status === 'success') {
            // Delete local storage
            localStorage.removeItem('info');
          }
        } catch (e) {}

        return push(`/checkout/success?payment_intent=${paymentIntent.id}`);
      } else {
        setError('Noe gikk galt, prøv igjen eller kontakt oss.');
      }

      setLoading(false);
    } catch {
      setError('Noe gikk galt, prøv igjen eller kontakt oss.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={style.form}>
      {error && <p className={style.error}>{error}</p>}
      <PaymentElement />

      <button
        className={style.payBtn}
        disabled={stripe == null || elements == null || loading}
        style={loading ? { cursor: 'not-allowed', opacity: '0.5' } : {}}
      >
        {loading
          ? 'Bearbeiding...'
          : `Betal ${totalPrice.toLocaleString().replaceAll(',', ' ')},- Nok`}
      </button>
    </form>
  );
};

export default CheckoutForm;
