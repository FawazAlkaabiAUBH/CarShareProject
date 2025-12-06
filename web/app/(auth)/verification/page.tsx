'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';

export default function VerificationPage() {
  const router = useRouter();
  const [code, setCode] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(60);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleCodeChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      // Auto-focus next input
      if (value && index < 3) {
        const nextInput = document.getElementById(`code-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleVerify = () => {
    const verificationCode = code.join('');
    if (verificationCode.length === 4) {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1d29] via-[#101828] to-[#1a1d29] flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        {/* Success Icon */}
        <div className="flex justify-center mb-8">
          <div className="w-[108px] h-[108px] bg-[#dc143c] rounded-full flex items-center justify-center">
            <svg className="w-16 h-16" viewBox="0 0 64 64" fill="none">
              <path d="M16 32l12 12 20-24" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-2xl font-medium text-white mb-3">
            Verification Code
          </h1>
          <p className="text-lg text-[#99a1af]">
            We sent a code to
          </p>
          <p className="text-lg text-[#dc143c] font-medium">
            +973 XXXX 1844
          </p>
        </div>

        {/* Code Input */}
        <div className="flex justify-center gap-4 mb-8">
          {code.map((digit, index) => (
            <input
              key={index}
              id={`code-${index}`}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleCodeChange(index, e.target.value)}
              className="w-16 h-16 bg-[#dc143c] text-white text-2xl font-bold text-center rounded-[18px] focus:outline-none focus:ring-2 focus:ring-white/20"
            />
          ))}
        </div>

        {/* Number Pad */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => {
                const emptyIndex = code.findIndex((c) => c === '');
                if (emptyIndex !== -1) {
                  handleCodeChange(emptyIndex, num.toString());
                }
              }}
              className="h-14 bg-white/5 hover:bg-white/10 text-white text-xl font-medium rounded-[18px] transition-all"
            >
              {num}
            </button>
          ))}
          <button className="h-14 bg-white/5 hover:bg-white/10 text-white text-xl rounded-[18px]">
            ⌫
          </button>
          <button
            onClick={() => {
              const emptyIndex = code.findIndex((c) => c === '');
              if (emptyIndex !== -1) {
                handleCodeChange(emptyIndex, '0');
              }
            }}
            className="h-14 bg-white/5 hover:bg-white/10 text-white text-xl font-medium rounded-[18px] transition-all"
          >
            0
          </button>
          <button
            onClick={() => setCode(['', '', '', ''])}
            className="h-14 bg-white/5 hover:bg-white/10 text-[#dc143c] text-xl rounded-[18px]"
          >
            ✓
          </button>
        </div>

        <Button
          variant="primary"
          size="md"
          className="w-full mb-4"
          onClick={handleVerify}
          disabled={code.some((c) => c === '')}
        >
          Verify Code
        </Button>

        <div className="text-center">
          {timer > 0 ? (
            <p className="text-[#99a1af]">
              Resend code in <span className="text-white font-medium">{timer}s</span>
            </p>
          ) : (
            <button
              onClick={() => setTimer(60)}
              className="text-[#dc143c] font-medium hover:underline"
            >
              Resend Code
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
