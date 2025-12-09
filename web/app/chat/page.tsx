'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Send } from 'lucide-react';
import { useAuth } from '@/lib/contexts/AuthContext';

export default function ChatPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  
  // Get current time minus 2 minutes
  const getTwoMinutesAgo = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - 2);
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const [messages, setMessages] = useState([
    { id: 1, fromUserId: 2, text: "Hi! I'm on my way to the pickup point", sentAt: getTwoMinutesAgo(), isRead: true },
    // { id: 2, fromUserId: 1, text: "Great! I'll be there in 5 minutes", sentAt: '10:31 AM', isRead: true },
  ]);
  const [otherUser, setOtherUser] = useState({
    name: 'Ahmed Ali',
    rating: 4.8,
  });
  const [safetyCode, setSafetyCode] = useState('4231');

  const handleSend = () => {
    if (!message.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      fromUserId: user?.userId || 1,
      text: message,
      sentAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: false,
    };

    setMessages([...messages, newMessage]);
    setMessage('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A1D29] via-[#101828] to-[#1A1D29] flex flex-col">
      {/* Header */}
      <div className="px-6 pt-[27px] pb-4 border-b border-white/10">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="w-[45px] h-[45px] bg-white/[0.00001] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1)] rounded-full flex items-center justify-center"
          >
            <ArrowLeft className="w-[27px] h-[27px] text-[#D1D5DC]" strokeWidth={2.25} />
          </button>

          <div className="flex-1">
            <h1 className="text-lg font-semibold text-white">{otherUser.name}</h1>
            <p className="text-sm text-[#99A1AF]">⭐ {otherUser.rating.toFixed(1)} • Online</p>
          </div>
        </div>
      </div>

      {/* Safety Code Card */}
      <div className="px-6 py-4">
        <div className="bg-gradient-to-br from-[#1E2939] to-[#101828] border-2 border-[#DC143C]/30 rounded-[18px] p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#99A1AF] mb-1">Safety Code</p>
              <p className="text-2xl font-bold text-white tracking-wider">{safetyCode}</p>
            </div>
            <div className="text-4xl">🔒</div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.map((msg) => {
          const isMine = msg.fromUserId === user?.userId;
          return (
            <div
              key={msg.id}
              className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[75%] rounded-[18px] px-4 py-3 ${
                  isMine
                    ? 'bg-gradient-to-b from-[#DC143C] to-[#8B0000] text-white'
                    : 'bg-[#1E2939] text-white'
                }`}
              >
                <p className="text-sm">{msg.text}</p>
                <p className="text-xs mt-1 opacity-70">{msg.sentAt}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input */}
      <div className="p-6 border-t border-white/10">
        <div className="flex gap-3">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message..."
            className="flex-1 h-[54px] bg-[#1E2939] border-2 border-[#364153] rounded-[18px] px-4 text-white placeholder:text-white/60 focus:border-[#DC143C] focus:outline-none"
          />
          <button
            onClick={handleSend}
            className="w-[54px] h-[54px] bg-gradient-to-b from-[#DC143C] to-[#8B0000] rounded-[18px] flex items-center justify-center hover:opacity-90 transition-opacity"
          >
            <Send className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
