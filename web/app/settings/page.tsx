'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Bell, Moon, Globe, Lock, CreditCard, MessageCircle, LogOut } from 'lucide-react';
import { useAuth } from '@/lib/contexts/AuthContext';

export default function SettingsPage() {
  const router = useRouter();
  const { logout } = useAuth();
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: true,
    language: 'en',
  });

  const handleLogout = () => {
    logout();
    router.push('/');
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

        <h1 className="text-2xl font-medium text-white">Settings</h1>
      </div>

      {/* Settings Sections */}
      <div className="px-6 pb-8 space-y-6">
        {/* Preferences */}
        <div className="bg-gradient-to-br from-[#1E2939]/80 to-[#101828] border border-white/10 rounded-[27px] p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Preferences</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-[#DC143C]" />
                <span className="text-white">Notifications</span>
              </div>
              <button
                onClick={() => setSettings({ ...settings, notifications: !settings.notifications })}
                className={`w-[52px] h-[30px] rounded-full transition-colors ${
                  settings.notifications ? 'bg-[#DC143C]' : 'bg-[#364153]'
                }`}
              >
                <div className={`w-[26px] h-[26px] bg-white rounded-full transition-transform ${
                  settings.notifications ? 'translate-x-[24px]' : 'translate-x-[2px]'
                }`} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Moon className="w-5 h-5 text-[#DC143C]" />
                <span className="text-white">Dark Mode</span>
              </div>
              <button
                onClick={() => setSettings({ ...settings, darkMode: !settings.darkMode })}
                className={`w-[52px] h-[30px] rounded-full transition-colors ${
                  settings.darkMode ? 'bg-[#DC143C]' : 'bg-[#364153]'
                }`}
              >
                <div className={`w-[26px] h-[26px] bg-white rounded-full transition-transform ${
                  settings.darkMode ? 'translate-x-[24px]' : 'translate-x-[2px]'
                }`} />
              </button>
            </div>

            <button className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-[#DC143C]" />
                <span className="text-white">Language</span>
              </div>
              <span className="text-[#99A1AF]">English</span>
            </button>
          </div>
        </div>

        {/* Account */}
        <div className="bg-gradient-to-br from-[#1E2939]/80 to-[#101828] border border-white/10 rounded-[27px] p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Account</h2>
          
          <div className="space-y-4">
            <button className="flex items-center gap-3 w-full text-left">
              <Lock className="w-5 h-5 text-[#DC143C]" />
              <span className="text-white">Privacy & Security</span>
            </button>

            <button 
              onClick={() => router.push('/payment-method')}
              className="flex items-center gap-3 w-full text-left"
            >
              <CreditCard className="w-5 h-5 text-[#DC143C]" />
              <span className="text-white">Payment Methods</span>
            </button>
          </div>
        </div>

        {/* Communication */}
        <div className="bg-gradient-to-br from-[#1E2939]/80 to-[#101828] border border-white/10 rounded-[27px] p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Communication</h2>
          
          <button className="flex items-center gap-3 w-full text-left">
            <MessageCircle className="w-5 h-5 text-[#DC143C]" />
            <span className="text-white">Chat Support</span>
          </button>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-[27px] text-red-500 hover:bg-red-500/20 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>

      {/* Dynamic Island */}
      <div className="fixed top-[25.5px] left-1/2 -translate-x-1/2 w-[126px] h-[31.5px] bg-black rounded-full z-50" />
    </div>
  );
}
