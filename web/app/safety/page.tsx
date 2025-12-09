'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Phone, Shield, AlertCircle } from 'lucide-react';

const EMERGENCY_CONTACTS = [
  { id: 1, name: 'Campus Security', phone: '+973 1234 5678', type: 'CAMPUS_SECURITY' },
  { id: 2, name: 'Bahrain Police', phone: '999', type: 'POLICE' },
  { id: 3, name: 'Ambulance', phone: '999', type: 'AMBULANCE' },
];

export default function SafetyPage() {
  const router = useRouter();

  const handleCall = (phone: string) => {
    window.location.href = `tel:${phone}`;
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

        <h1 className="text-2xl font-medium text-white">Safety Center</h1>
      </div>

      {/* Content */}
      <div className="px-6 pb-8 space-y-6">
        {/* Safety Priority Card */}
        <div className="bg-gradient-to-br from-[#1E2939] to-[#101828] border border-white/10 rounded-[27px] p-6 text-center">
          <Shield className="w-16 h-16 text-[#DC143C] mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Your safety is our priority</h2>
          <p className="text-[#99A1AF]">24/7 Support Available</p>
        </div>

        {/* Emergency SOS */}
        <div className="bg-gradient-to-br from-red-600/20 to-red-900/20 border-2 border-red-500/50 rounded-[27px] p-6 text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Emergency SOS</h3>
          <p className="text-[#99A1AF] text-sm mb-4">Hold for 3 seconds to activate</p>
          <button className="w-full h-[72px] bg-red-500 rounded-[18px] text-white font-semibold text-lg hover:bg-red-600 transition-colors">
            Hold for Emergency
          </button>
        </div>

        {/* Emergency Contacts */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Emergency Contacts</h3>
          <div className="space-y-3">
            {EMERGENCY_CONTACTS.map((contact) => (
              <div
                key={contact.id}
                className="flex items-center justify-between p-4 bg-gradient-to-br from-[#1E2939]/80 to-[#101828] border border-white/10 rounded-[18px]"
              >
                <div>
                  <h4 className="text-white font-medium">{contact.name}</h4>
                  <p className="text-[#99A1AF] text-sm">{contact.phone}</p>
                </div>
                <button
                  onClick={() => handleCall(contact.phone)}
                  className="w-[54px] h-[54px] bg-green-500 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors"
                >
                  <Phone className="w-6 h-6 text-white" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Safety Tips */}
        <div className="bg-gradient-to-br from-[#1E2939]/80 to-[#101828] border border-white/10 rounded-[27px] p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Safety Tips</h3>
          <ul className="space-y-3 text-[#99A1AF]">
            <li className="flex items-start gap-2">
              <span className="text-[#DC143C] font-bold">•</span>
              <span>Always verify the safety code before getting in</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#DC143C] font-bold">•</span>
              <span>Share your ride details with a friend</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#DC143C] font-bold">•</span>
              <span>Trust your instincts - it's okay to cancel</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
