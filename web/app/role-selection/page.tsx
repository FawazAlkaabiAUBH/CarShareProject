'use client';

import { useRouter } from 'next/navigation';
import { Car, Users } from 'lucide-react';
import { useAuth } from '@/lib/contexts/AuthContext';

export default function RoleSelectionPage() {
  const router = useRouter();
  const { user, setRole } = useAuth();

  const handleRoleSelect = (role: 'DRIVER' | 'RIDER') => {
    setRole(role);
    router.push(`/dashboard/${role.toLowerCase()}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-gradient-to-br from-[#1A1D29] via-[#101828] to-[#1A1D29]">
      <div className="max-w-md w-full space-y-8">
        {/* Title */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-medium leading-9 tracking-[0.07px] text-white">
            Welcome back, {user?.name || 'Student'}
          </h1>
          <p className="text-lg leading-[27px] tracking-[-0.44px] text-[#99A1AF]">
            How would you like to proceed?
          </p>
        </div>

        {/* Role Cards */}
        <div className="space-y-6">
          {/* Driver Card */}
          <button
            onClick={() => handleRoleSelect('DRIVER')}
            className="w-full p-8 bg-gradient-to-br from-[#1E2939]/80 to-[#101828] border-2 border-white/10 rounded-[27px] hover:border-[#DC143C]/50 hover:shadow-[0_0_30px_rgba(220,20,60,0.3)] transition-all group"
          >
            <div className="flex items-start gap-6">
              <div className="w-[72px] h-[72px] bg-gradient-to-b from-[#DC143C] to-[#8B0000] rounded-[18px] flex items-center justify-center flex-shrink-0">
                <Car className="w-10 h-10 text-white" strokeWidth={2} />
              </div>
              <div className="flex-1 text-left">
                <h2 className="text-2xl font-semibold text-white mb-2">
                  I'm a Driver
                </h2>
                <p className="text-base leading-6 text-[#99A1AF]">
                  Offer rides and earn while helping fellow students
                </p>
              </div>
            </div>
          </button>

          {/* Rider Card */}
          <button
            onClick={() => handleRoleSelect('RIDER')}
            className="w-full p-8 bg-gradient-to-br from-[#1E2939]/80 to-[#101828] border-2 border-white/10 rounded-[27px] hover:border-[#DC143C]/50 hover:shadow-[0_0_30px_rgba(220,20,60,0.3)] transition-all group"
          >
            <div className="flex items-start gap-6">
              <div className="w-[72px] h-[72px] bg-gradient-to-b from-[#DC143C] to-[#8B0000] rounded-[18px] flex items-center justify-center flex-shrink-0">
                <Users className="w-10 h-10 text-white" strokeWidth={2} />
              </div>
              <div className="flex-1 text-left">
                <h2 className="text-2xl font-semibold text-white mb-2">
                  I'm a Rider
                </h2>
                <p className="text-base leading-6 text-[#99A1AF]">
                  Find affordable rides with trusted students
                </p>
              </div>
            </div>
          </button>
        </div>

        {/* Info Text */}
        <p className="text-center text-sm text-[#6A7282]">
          You can switch between roles anytime from your dashboard
        </p>
      </div>

      {/* Dynamic Island */}
      <div className="fixed top-[25.5px] left-1/2 -translate-x-1/2 w-[126px] h-[31.5px] bg-black rounded-full z-50" />
    </div>
  );
}
