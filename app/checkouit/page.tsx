'use client';

import { useEffect, useState } from 'react';
import StripeWrapper from '@/app/lib/stripe';
import CheckoutForm from './checkoutForm';

export default function CheckoutPage() {
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
  fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/payments/create-intent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: 10000 }),
    })
      .then(res => res.json())
      .then(data => setClientSecret(data.clientSecret));
  }, []);

  if (!clientSecret) return <p>Loading...</p>;

  return (
    <StripeWrapper clientSecret={clientSecret}>
      <CheckoutForm  clientSecret={clientSecret}/>
    </StripeWrapper>
  );
}
