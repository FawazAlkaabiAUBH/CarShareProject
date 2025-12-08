'use client';

import React, { useState } from 'react';
import { Card } from './ui/Card';

interface PaymentMethodSelectorProps {
  selectedMethod: 'CASH' | 'BENEFITPAY';
  onMethodChange: (method: 'CASH' | 'BENEFITPAY') => void;
  benefitPayPhone?: string;
  onBenefitPayPhoneChange?: (phone: string) => void;
  showPhoneInput?: boolean; // For riders entering their BenefitPay phone
}

export const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  selectedMethod,
  onMethodChange,
  benefitPayPhone = '',
  onBenefitPayPhoneChange,
  showPhoneInput = false,
}) => {
  const [phoneError, setPhoneError] = useState('');

  const handlePhoneChange = (value: string) => {
    // Only allow digits
    const cleaned = value.replace(/\D/g, '');
    
    if (cleaned.length > 8) return;
    
    if (onBenefitPayPhoneChange) {
      onBenefitPayPhoneChange(cleaned);
    }

    // Validate
    if (cleaned.length > 0 && cleaned.length !== 8) {
      setPhoneError('Phone number must be 8 digits');
    } else {
      setPhoneError('');
    }
  };

  return (
    <Card variant="glass">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3 pb-3 border-b border-white/10">
          <div className="w-10 h-10 bg-[#dc143c]/20 border-2 border-[#dc143c] rounded-full flex items-center justify-center">
            <span className="text-xl">💳</span>
          </div>
          <div>
            <h3 className="text-white font-semibold">Payment Method</h3>
            <p className="text-sm text-[#99a1af]">Choose how you'll pay</p>
          </div>
        </div>

        {/* Payment Options */}
        <div className="space-y-3">
          {/* Cash Option */}
          <button
            onClick={() => onMethodChange('CASH')}
            className={`w-full p-4 rounded-[18px] border-2 transition-all ${
              selectedMethod === 'CASH'
                ? 'bg-[#dc143c]/10 border-[#dc143c]'
                : 'bg-white/5 border-white/10 hover:border-white/20'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selectedMethod === 'CASH'
                    ? 'border-[#dc143c] bg-[#dc143c]'
                    : 'border-white/30'
                }`}
              >
                {selectedMethod === 'CASH' && (
                  <div className="w-2 h-2 bg-white rounded-full" />
                )}
              </div>
              <div className="flex-1 text-left">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">💵</span>
                  <span className="text-white font-medium">Cash</span>
                </div>
                <p className="text-sm text-[#99a1af] mt-1">
                  Pay with cash at the end of the ride
                </p>
              </div>
            </div>
          </button>

          {/* BenefitPay Option */}
          <button
            onClick={() => onMethodChange('BENEFITPAY')}
            className={`w-full p-4 rounded-[18px] border-2 transition-all ${
              selectedMethod === 'BENEFITPAY'
                ? 'bg-[#dc143c]/10 border-[#dc143c]'
                : 'bg-white/5 border-white/10 hover:border-white/20'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selectedMethod === 'BENEFITPAY'
                    ? 'border-[#dc143c] bg-[#dc143c]'
                    : 'border-white/30'
                }`}
              >
                {selectedMethod === 'BENEFITPAY' && (
                  <div className="w-2 h-2 bg-white rounded-full" />
                )}
              </div>
              <div className="flex-1 text-left">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">📱</span>
                  <span className="text-white font-medium">BenefitPay</span>
                </div>
                <p className="text-sm text-[#99a1af] mt-1">
                  Pay securely via BenefitPay
                </p>
              </div>
            </div>
          </button>
        </div>

        {/* BenefitPay Phone Input (for riders) */}
        {selectedMethod === 'BENEFITPAY' && showPhoneInput && (
          <div className="mt-4 p-4 bg-[#dc143c]/10 border border-[#dc143c]/30 rounded-[18px]">
            <label className="block text-sm text-white font-medium mb-2">
              Your BenefitPay Phone Number
            </label>
            <input
              type="tel"
              value={benefitPayPhone}
              onChange={(e) => handlePhoneChange(e.target.value)}
              placeholder="12345678"
              maxLength={8}
              className="w-full bg-[#1a1d29] border-2 border-white/10 rounded-xl px-4 py-3 text-white placeholder-[#6a7282] focus:border-[#dc143c] focus:outline-none transition-colors"
            />
            {phoneError && (
              <p className="text-red-400 text-xs mt-1">{phoneError}</p>
            )}
            <p className="text-xs text-[#99a1af] mt-2">
              💡 We'll share this with the driver so they can request payment
            </p>
          </div>
        )}

        {/* Info */}
        <div className="bg-white/5 border border-white/10 rounded-[18px] p-3">
          <p className="text-xs text-[#99a1af] leading-relaxed">
            {selectedMethod === 'CASH' ? (
              <>
                💡 <span className="font-semibold text-white">Cash payments:</span> Pay the driver at the end of your ride. Please have exact change if possible.
              </>
            ) : (
              <>
                💡 <span className="font-semibold text-white">BenefitPay:</span> You'll receive the driver's BenefitPay number after booking. Complete payment via the BenefitPay app.
              </>
            )}
          </p>
        </div>
      </div>
    </Card>
  );
};
