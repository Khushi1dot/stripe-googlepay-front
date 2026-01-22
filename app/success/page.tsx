import { Suspense } from 'react';
import SuccessClient from './successClient';

export default function SuccessPage() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Payment Status</h1>

      <Suspense fallback={<p>Loading payment status...</p>}>
        <SuccessClient />
      </Suspense>
    </div>
  );
}
