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
  useElements,
} from '@stripe/react-stripe-js';
import './checkout.css';

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();

  const [paymentRequest, setPaymentRequest] = useState<any>(null);
  const [canUseWallet, setCanUseWallet] = useState(false);

  useEffect(() => {
    if (!stripe) return;

    const pr = stripe.paymentRequest({
      country: 'US',
      currency: 'usd',
      total: {
        label: 'Total',
        amount: 10000,
      },
      requestPayerName: true,
      requestPayerEmail: true,
    });

    pr.canMakePayment().then((result) => {
      if (result) {
        setPaymentRequest(pr);
        setCanUseWallet(true);
      }
    });

    pr.on('paymentmethod', async (ev) => {
         if (!stripe) {
    ev.complete('fail');
    return;
  }
    //   const { error, paymentIntent } = await stripe.confirmPayment({
    //     elements,
    //     confirmParams: {
    //       payment_method: ev.paymentMethod.id,
    //     //   return_url: 'http://localhost:3000/success',
    //     return_url: 'https://stripe-googlepay-front-zeta.vercel.app/success',
    //     },
    //     redirect: 'if_required',
    //   });

    const { error, paymentIntent } = await stripe.confirmCardPayment(
  process.env.NEXT_PUBLIC_STRIPE_CLIENT_SECRET!,
  {
    payment_method: ev.paymentMethod.id,
  }
);

      if (error) {
        ev.complete('fail');
      } else {
        ev.complete('success');

        if (paymentIntent?.status === 'succeeded') {
          window.location.href =
            // 'http://localhost:3000/success?redirect_status=succeeded';
            'https://stripe-googlepay-front-zeta.vercel.app/success?redirect_status=succeeded';
        }
      }
    });
  }, [stripe, elements]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // return_url: 'http://localhost:3000/success',
        return_url: 'https://stripe-googlepay-front-zeta.vercel.app/success',
      },
    });

    if (result.error) {
      console.error(result.error.message);
    }
  };

  return (
    <div className="checkout-container">
      <h2 className="checkout-title">Complete your payment</h2>

      {/* Wallet button */}
      {canUseWallet && paymentRequest && (
        <div className="wallet-section">
          <PaymentRequestButtonElement
            options={{ paymentRequest }}
          />
          <div className="divider">OR</div>
        </div>
      )}

      {/* Payment Element */}
      <form onSubmit={handleSubmit} className="checkout-form">
        <PaymentElement />

        <button
          type="submit"
          className="pay-button"
          disabled={!stripe}
        >
          Pay $100.00
        </button>
      </form>
    </div>
  );
}
