'use client';

import React from 'react';
import { Card } from './ui/Card';

interface FareSummaryProps {
  baseFare?: number;
  distanceFare?: number;
  serviceFee?: number;
  totalFare?: number;
  driverEarnings?: number;
  farePerSeat?: number;
  totalSeats?: number;
  distance?: number;
  isDriver?: boolean; // Show driver earnings vs rider payment
}

export const FareSummary: React.FC<FareSummaryProps> = ({
  baseFare = 0,
  distanceFare = 0,
  serviceFee = 0,
  totalFare = 0,
  driverEarnings = 0,
  farePerSeat = 0,
  totalSeats = 1,
  distance = 0,
  isDriver = false,
}) => {
  const currencyCode = 'BD';

  return (
    <Card variant="glass">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3 pb-3 border-b border-white/10">
          <div className="w-10 h-10 bg-[#dc143c]/20 border-2 border-[#dc143c] rounded-full flex items-center justify-center">
            <span className="text-xl">💰</span>
          </div>
          <div>
            <h3 className="text-white font-semibold">
              {isDriver ? 'Earnings Breakdown' : 'Fare Breakdown'}
            </h3>
            <p className="text-sm text-[#99a1af]">
              {distance > 0 && `${distance.toFixed(1)} km journey`}
            </p>
          </div>
        </div>

        {/* Breakdown Details */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#99a1af]">Base fare</span>
            <span className="text-white">{baseFare.toFixed(3)} {currencyCode}</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-[#99a1af]">
              Distance fare {distance > 0 && `(${distance.toFixed(1)} km)`}
            </span>
            <span className="text-white">{distanceFare.toFixed(3)} {currencyCode}</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-[#99a1af]">Service fee (10%)</span>
            <span className="text-white">{serviceFee.toFixed(3)} {currencyCode}</span>
          </div>

          <div className="border-t border-white/10 pt-3 flex items-center justify-between">
            <span className="text-white font-medium">Total fare</span>
            <span className="text-white font-semibold">{totalFare.toFixed(3)} {currencyCode}</span>
          </div>

          {isDriver && driverEarnings > 0 && (
            <>
              <div className="bg-[#10b981]/10 border border-[#10b981]/30 rounded-[18px] p-3 mt-2">
                <div className="flex items-center justify-between">
                  <span className="text-[#10b981] font-medium">Your earnings</span>
                  <span className="text-[#10b981] font-bold text-lg">
                    {driverEarnings.toFixed(3)} {currencyCode}
                  </span>
                </div>
                <p className="text-xs text-[#10b981]/70 mt-1">
                  After service fee deduction
                </p>
              </div>
            </>
          )}

          {totalSeats > 1 && (
            <div className="bg-[#dc143c]/10 border border-[#dc143c]/30 rounded-[18px] p-3 mt-2">
              <div className="flex items-center justify-between">
                <span className="text-[#dc143c] font-medium">Per seat</span>
                <span className="text-[#dc143c] font-bold">
                  {farePerSeat.toFixed(3)} {currencyCode}
                </span>
              </div>
              <p className="text-xs text-[#dc143c]/70 mt-1">
                Total seats: {totalSeats}
              </p>
            </div>
          )}
        </div>

        {/* Info Note */}
        <div className="bg-white/5 border border-white/10 rounded-[18px] p-3 mt-4">
          <p className="text-xs text-[#99a1af] leading-relaxed">
            {isDriver ? (
              <>
                💡 <span className="font-semibold text-white">Driver tip:</span> The service fee helps maintain the platform and ensure safe rides for everyone.
              </>
            ) : (
              <>
                💡 <span className="font-semibold text-white">Payment info:</span> The fare includes a small service fee that helps maintain the platform.
              </>
            )}
          </p>
        </div>
      </div>
    </Card>
  );
};
