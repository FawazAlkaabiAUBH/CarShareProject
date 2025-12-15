'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, CreditCard, Banknote, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Suspense } from 'react';

function PaymentMethodContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const amount = searchParams.get('amount') || '0.00';
  
  const [selectedMethod, setSelectedMethod] = useState<'BENEFITPAY' | 'CASH' | null>(null);

  const handleConfirm = () => {
    if (!selectedMethod) return;
    router.push(`/payment-success?amount=${amount}&method=${selectedMethod}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A1D29] via-[#101828] to-[#1A1D29]">
      {/* Header */}
      <div className="px-6 pt-[27px] pb-6">
        <button
          onClick={() => router.back()}
          className="w-[45px] h-[45px] bg-white/[0.00001] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1)] rounded-full flex items-center justify-center mb-6"
        >
          <ArrowLeft className="w-[27px] h-[27px] text-[#D1D5DC]" strokeWidth={2.25} />
        </button>

        <h1 className="text-2xl font-medium text-white mb-2">Payment Method</h1>
        <p className="text-lg text-[#99A1AF]">Select how you'd like to pay</p>
      </div>

      {/* Amount */}
      <div className="px-6 pb-6">
        <div className="bg-gradient-to-br from-[#1E2939] to-[#101828] border border-white/10 rounded-[27px] p-6 text-center">
          <p className="text-[#99A1AF] mb-2">Total Amount</p>
          <p className="text-4xl font-bold text-white">BHD {amount}</p>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="px-6 pb-8 space-y-4">
        <h3 className="text-lg font-semibold text-white mb-4">Payment Options</h3>

        {/* BenefitPay */}
        <button
          onClick={() => setSelectedMethod('BENEFITPAY')}
          className={`w-full p-6 rounded-[27px] border-2 transition-all ${
            selectedMethod === 'BENEFITPAY'
              ? 'bg-gradient-to-br from-[#1E2939] to-[#101828] border-[#DC143C]'
              : 'bg-gradient-to-br from-[#1E2939]/50 to-[#101828]/50 border-white/10'
          }`}
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-b from-blue-500 to-blue-700 rounded-[18px] flex items-center justify-center flex-shrink-0">
              <CreditCard className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1 text-left">
              <h4 className="text-white font-semibold mb-1">Benefit Pay</h4>
              <p className="text-sm text-[#99A1AF]">Mobile wallet payment</p>
            </div>
            {selectedMethod === 'BENEFITPAY' && (
              <CheckCircle2 className="w-6 h-6 text-[#DC143C]" />
            )}
          </div>
        </button>

        {/* Cash */}
        <button
          onClick={() => setSelectedMethod('CASH')}
          className={`w-full p-6 rounded-[27px] border-2 transition-all ${
            selectedMethod === 'CASH'
              ? 'bg-gradient-to-br from-[#1E2939] to-[#101828] border-[#DC143C]'
              : 'bg-gradient-to-br from-[#1E2939]/50 to-[#101828]/50 border-white/10'
          }`}
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-b from-green-500 to-green-700 rounded-[18px] flex items-center justify-center flex-shrink-0">
              <Banknote className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1 text-left">
              <h4 className="text-white font-semibold mb-1">Cash</h4>
              <p className="text-sm text-[#99A1AF]">Pay with cash</p>
            </div>
            {selectedMethod === 'CASH' && (
              <CheckCircle2 className="w-6 h-6 text-[#DC143C]" />
            )}
          </div>
        </button>

        <Button
          variant="primary"
          className="w-full mt-8"
          onClick={handleConfirm}
          disabled={!selectedMethod}
        >
          Confirm Payment Method
        </Button>
      </div>
    </div>
  );
}

export default function PaymentMethodPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-white">Loading...</div>}>
      <PaymentMethodContent />
    </Suspense>
  );
}
