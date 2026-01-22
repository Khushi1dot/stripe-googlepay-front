'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function SuccessClient() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState('');

  useEffect(() => {
    const paymentIntent = searchParams.get('payment_intent');
    const redirectStatus = searchParams.get('redirect_status');

    if (redirectStatus === 'succeeded') {
      setStatus(`Payment succeeded! Intent: ${paymentIntent}`);
    } else {
      setStatus('Payment failed or canceled');
    }
  }, [searchParams]);

  return <p>{status}</p>;
}
