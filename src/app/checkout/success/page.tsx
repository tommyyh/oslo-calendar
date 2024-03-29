import Nav from '@/components/Nav/Nav';
import style from './success.module.scss';
import Stripe from 'stripe';
import { notFound } from 'next/navigation';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

const Success = async ({
  searchParams,
}: {
  searchParams: { payment_intent: string };
}) => {
  let isSuccess;

  try {
    if (!searchParams.payment_intent) return notFound();

    const paymentIntent = await stripe.paymentIntents.retrieve(
      searchParams.payment_intent
    );

    isSuccess = paymentIntent.status === 'succeeded';
  } catch {
    isSuccess = false;
  }

  return (
    <div className={style.main}>
      <Nav formStage={5} />

      <div className={style.right}>
        <h5 style={isSuccess ? {} : { color: '#df1b41' }}>
          {isSuccess ? 'Alt i orden!' : 'Det oppstod et problem'}
        </h5>

        <h1>
          {isSuccess ? 'Reisen din ble bestilt med suksess' : 'Noe gikk galt'}
        </h1>
        <p>
          {isSuccess
            ? 'Du vil snart motta en e-postbekreftelse og en SMS-bekreftelse! Hvis du ikke mottar den i løpet av de neste 12 timene, må du kontakte oss, så fikser vi det.'
            : 'Vi beklager, men noe gikk galt da du bestilte reisen. Hvis kortet ditt likevel ble belastet, kan du sende oss en melding, så refunderer vi beløpet eller bestiller reisen på nytt.'}
        </p>

        <a href={'/'} className={style.goBack}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
            <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z" />
          </svg>
          Dra hjem igjen
        </a>
      </div>
    </div>
  );
};

export default Success;
