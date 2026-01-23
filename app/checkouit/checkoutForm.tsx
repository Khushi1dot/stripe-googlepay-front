// import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

// export default function CheckoutForm() {
//   const stripe = useStripe();
//   const elements = useElements();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!stripe || !elements) return;

//     const result = await stripe.confirmPayment({
//       elements,
//       confirmParams: {
//         return_url: 'http://localhost:3000/success',
//       },
//     });

//     if (result.error) {
//       console.log(result.error.message);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <PaymentElement />
//       <button type="submit" disabled={!stripe}>Pay</button>
//     </form>
//   );
// }
// 'use client';

// import { useEffect, useState } from 'react';
// import {
//   PaymentElement,
//   PaymentRequestButtonElement,
//   useStripe,
//   useElements,
// } from '@stripe/react-stripe-js';

// export default function CheckoutForm() {
//   const stripe = useStripe();
//   const elements = useElements();

//   const [paymentRequest, setPaymentRequest] = useState<any>(null);
//   const [canUseWallet, setCanUseWallet] = useState(false);

//   useEffect(() => {
//     if (!stripe) return;

//     const pr = stripe.paymentRequest({
//       country: 'US',
//       currency: 'usd',
//       total: {
//         label: 'Total',
//         amount: 10000,
//       },
//       requestPayerName: true,
//       requestPayerEmail: true,
//     });

//     pr.canMakePayment().then((result) => {
//       if (result) {
//         setPaymentRequest(pr);
//         setCanUseWallet(true);
//       }
//     });

//     pr.on('paymentmethod', async (ev) => {
//       const { error, paymentIntent } = await stripe.confirmPayment({
//         elements,
//         confirmParams: {
//           payment_method: ev.paymentMethod.id,
//           return_url: 'http://localhost:3000/success',
//         },
//         redirect: 'if_required',
//       });

//       if (error) {
//         ev.complete('fail');
//       } else {
//         ev.complete('success');

//         if (paymentIntent?.status === 'succeeded') {
//           window.location.href =
//             'http://localhost:3000/success?redirect_status=succeeded';
//         }
//       }
//     });
//   }, [stripe, elements]);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!stripe || !elements) return;

//     const result = await stripe.confirmPayment({
//       elements,
//       confirmParams: {
//         return_url: 'http://localhost:3000/success',
//       },
//     });

//     if (result.error) {
//       console.error(result.error.message);
//     }
//   };

//   return (
//     <>
//       {/* Wallet button (Google Pay / Apple Pay) */}
//       {canUseWallet && paymentRequest && (
//         <div style={{ marginBottom: '16px' }}>
//           <PaymentRequestButtonElement
//             options={{ paymentRequest }}
//           />
//         </div>
//       )}

//       {/* Fallback card + methods */}
//       <form onSubmit={handleSubmit}>
//         <PaymentElement />
//         <button type="submit" disabled={!stripe}>
//           Pay
//         </button>
//       </form>
//     </>
//   );
// }
'use client';

import { useEffect, useState } from 'react';
import {
  PaymentElement,
  PaymentRequestButtonElement,
  useStripe,
} from '@stripe/react-stripe-js';

export default function CheckoutForm({
  clientSecret,
}: {
  clientSecret: string;
}) {
  const stripe = useStripe();
  const [paymentRequest, setPaymentRequest] = useState<any>(null);

  useEffect(() => {
    if (!stripe) return;

    const pr = stripe.paymentRequest({
      country: 'US',
      currency: 'usd',
      total: { label: 'Total', amount: 10000 },
      requestPayerName: true,
      requestPayerEmail: true,
    });

    pr.canMakePayment().then(result => {
      if (result) setPaymentRequest(pr);
    });

    pr.on('paymentmethod', async ev => {
      if (!stripe) return ev.complete('fail');

      const { error, paymentIntent } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: ev.paymentMethod.id,
        });

      if (error) {
        ev.complete('fail');
      } else {
        ev.complete('success');
        if (paymentIntent?.status === 'succeeded') {
          window.location.href =
            '/success?redirect_status=succeeded';
        }
      }
    });
  }, [stripe, clientSecret]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe) return;

    await stripe.confirmPayment({
      clientSecret,
      confirmParams: {
        return_url:
          'https://stripe-googlepay-front-zeta.vercel.app/success',
      },
    });
  };

  return (
    <div className="checkout-container">
      {paymentRequest && (
        <>
          <PaymentRequestButtonElement
            options={{ paymentRequest }}
          />
          <div className="divider">OR</div>
        </>
      )}

      <form onSubmit={handleSubmit}>
        <PaymentElement />
        <button type="submit">Pay $100</button>
      </form>
    </div>
  );
}
