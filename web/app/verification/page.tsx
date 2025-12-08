'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { apiClient } from '@/lib/api';

function VerificationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const contact = searchParams.get('contact') || '';
  
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerify = async () => {
    const verificationCode = code.join('');
    if (verificationCode.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await apiClient.post('/auth/verify', {
        emailOrPhone: contact,
        code: verificationCode,
      });
      
      // Navigate to role selection
      router.push('/role-selection');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid verification code');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;

    try {
      await apiClient.post('/auth/resend-code', { emailOrPhone: contact });
      setTimer(60);
      setCanResend(false);
      setError('');
    } catch (err: any) {
      setError('Failed to resend code');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-gradient-to-br from-[#1A1D29] via-[#101828] to-[#1A1D29]">
      <div className="max-w-md w-full">
        {/* Icon */}
        <div className="flex justify-center mb-8">
          <div className="w-[108px] h-[108px] bg-gradient-to-b from-[#DC143C] to-[#8B0000] rounded-[27px] shadow-2xl flex items-center justify-center">
            <CheckCircle2 className="w-[72px] h-[72px] text-white" strokeWidth={2} />
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8 space-y-2">
          <h1 className="text-2xl font-medium leading-9 tracking-[0.07px] text-white">
            Verification Code
          </h1>
          <p className="text-lg leading-[27px] tracking-[-0.44px] text-[#99A1AF]">
            We've sent a code to
          </p>
          <p className="text-lg leading-[27px] tracking-[-0.44px] text-white font-medium">
            {contact}
          </p>
        </div>

        {/* Code Input */}
        <div className="flex gap-3 justify-center mb-6">
          {code.map((digit, index) => (
            <input
              key={index}
              id={`code-${index}`}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleCodeChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-[54px] h-[63px] bg-[#1E2939] border-2 border-[#364153] rounded-[18px] text-center text-2xl font-medium text-white focus:border-[#DC143C] focus:outline-none transition-colors"
            />
          ))}
        </div>

        {/* Timer and Resend */}
        <div className="text-center mb-6">
          {canResend ? (
            <button
              onClick={handleResend}
              className="text-lg leading-[27px] tracking-[-0.44px] text-[#DC143C] font-medium"
            >
              Resend Code
            </button>
          ) : (
            <p className="text-lg leading-[27px] tracking-[-0.44px] text-[#99A1AF]">
              Resend code in {timer}s
            </p>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-[18px] text-red-500 text-sm text-center">
            {error}
          </div>
        )}

        {/* Verify Button */}
        <Button
          variant="primary"
          className="w-full !bg-white !text-[#1A1D29] hover:!bg-white/90"
          onClick={handleVerify}
          disabled={loading || code.join('').length !== 6}
        >
          {loading ? 'Verifying...' : 'Verify'}
        </Button>
      </div>

      {/* Dynamic Island */}
      <div className="fixed top-[25.5px] left-1/2 -translate-x-1/2 w-[126px] h-[31.5px] bg-black rounded-full z-50" />
    </div>
  );
}

export default function VerificationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-white">Loading...</div>}>
      <VerificationContent />
    </Suspense>
  );
}
