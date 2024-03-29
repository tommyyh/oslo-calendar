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
          <Form totalPrice={totalPrice} />
        </Elements>
      </div>
    </div>
  );
};

const Form = ({ totalPrice }: any) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (stripe == null || elements == null) return;

    setLoading(true);

    // Confirm payment
    stripe
      .confirmPayment({
        elements,
        confirmParams: {
          return_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/checkout/success`,
        },
      })
      .then(({ error }) => {
        if (error.type === 'card_error' || error.type === 'validation_error') {
          setError(error.message);
        } else {
          setError('Something went wrong. Please try again or contact us');
        }
      })
      .finally(() => {
        // Clear local storage
        localStorage.removeItem('info');

        setLoading(false);
      });
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
