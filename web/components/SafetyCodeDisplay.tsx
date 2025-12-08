'use client';

import React, { useState } from 'react';
import { Card } from './ui/Card';

interface SafetyCodeDisplayProps {
  safetyCode: string;
  rideStatus: 'AVAILABLE' | 'BOOKED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  isDriver: boolean;
}

export const SafetyCodeDisplay: React.FC<SafetyCodeDisplayProps> = ({
  safetyCode,
  rideStatus,
  isDriver,
}) => {
  const [copied, setCopied] = useState(false);

  // Only show safety code when ride is in progress or for drivers when booked
  const shouldShowCode = 
    rideStatus === 'IN_PROGRESS' || 
    (isDriver && rideStatus === 'BOOKED');

  if (!shouldShowCode || !safetyCode) {
    return null;
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(safetyCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card variant="glass" className="border-[#dc143c]/30">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#dc143c]/20 border-2 border-[#dc143c] rounded-full flex items-center justify-center">
            <span className="text-xl">🔒</span>
          </div>
          <div>
            <h3 className="text-white font-semibold">
              {isDriver ? 'Safety Code' : 'Verify Safety Code'}
            </h3>
            <p className="text-sm text-[#99a1af]">
              {isDriver 
                ? 'Share this code with your passengers' 
                : 'Ask the driver for this code'}
            </p>
          </div>
        </div>

        {/* Safety Code Display */}
        <div className="bg-[#1a1d29] border-2 border-[#dc143c] rounded-[18px] p-6">
          <div className="text-center">
            <p className="text-sm text-[#99a1af] mb-2">Safety Code</p>
            <div className="flex items-center justify-center gap-3">
              {safetyCode.split('').map((digit, index) => (
                <div
                  key={index}
                  className="w-14 h-16 bg-[#dc143c]/10 border-2 border-[#dc143c] rounded-xl flex items-center justify-center"
                >
                  <span className="text-3xl font-bold text-white">{digit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Copy Button */}
        {isDriver && (
          <button
            onClick={handleCopy}
            className="w-full bg-white/5 hover:bg-white/10 border-2 border-white/10 rounded-[18px] py-3 text-white font-medium transition-colors"
          >
            {copied ? '✓ Copied!' : '📋 Copy Code'}
          </button>
        )}

        {/* Info Message */}
        <div className="bg-[#dc143c]/10 border border-[#dc143c]/30 rounded-[18px] p-4">
          <p className="text-sm text-[#99a1af] leading-relaxed">
            {isDriver ? (
              <>
                <span className="text-[#dc143c] font-semibold">Important:</span> Only share this code with passengers who have booked seats on this ride. This helps ensure passenger safety.
              </>
            ) : (
              <>
                <span className="text-[#dc143c] font-semibold">Safety First:</span> Before starting the ride, verify that the driver's safety code matches the one shown here. Do not proceed if the codes don't match.
              </>
            )}
          </p>
        </div>
      </div>
    </Card>
  );
};
