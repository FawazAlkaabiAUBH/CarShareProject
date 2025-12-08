'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle2, Home } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Suspense } from 'react';

function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const amount = searchParams.get('amount') || '0.00';
  const method = searchParams.get('method') || 'CASH';
  const transactionId = `TXN${Date.now().toString().slice(-8)}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A1D29] via-[#101828] to-[#1A1D29] flex items-center justify-center px-6">
      <div className="max-w-md w-full">
        {/* Success Icon */}
        <div className="flex justify-center mb-8">
          <div className="w-[120px] h-[120px] bg-gradient-to-b from-green-500 to-green-700 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-[72px] h-[72px] text-white" strokeWidth={2} />
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold text-white mb-2">Payment Successful!</h1>
          <p className="text-lg text-[#99A1AF]">Your payment has been processed</p>
        </div>

        {/* Payment Details */}
        <div className="bg-gradient-to-br from-[#1E2939] to-[#101828] border border-white/10 rounded-[27px] p-6 mb-8">
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-white/10">
              <span className="text-[#99A1AF]">Amount Paid</span>
              <span className="text-2xl font-bold text-white">BHD {amount}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-[#99A1AF]">Payment Method</span>
              <span className="text-white font-medium">
                {method === 'BENEFITPAY' ? 'Benefit Pay' : 'Cash'}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-[#99A1AF]">Transaction ID</span>
              <span className="text-white font-mono text-sm">{transactionId}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-[#99A1AF]">Date & Time</span>
              <span className="text-white">
                {new Date().toLocaleString('en-GB', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Button
            variant="primary"
            className="w-full"
            onClick={() => router.push('/feedback')}
          >
            Rate Your Ride
          </Button>
          
          <button
            onClick={() => router.push('/dashboard/rider')}
            className="w-full flex items-center justify-center gap-2 py-4 text-[#DC143C] font-medium"
          >
            <Home className="w-5 h-5" />
            <span>Back to Home</span>
          </button>
        </div>
      </div>

      {/* Dynamic Island */}
      <div className="fixed top-[25.5px] left-1/2 -translate-x-1/2 w-[126px] h-[31.5px] bg-black rounded-full z-50" />
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-white">Loading...</div>}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
