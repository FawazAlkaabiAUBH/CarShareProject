'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Star } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function FeedbackPage() {
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [selectedTips, setSelectedTips] = useState<string[]>([]);

  const QUICK_TIPS = [
    'Great driver',
    'On time',
    'Clean car',
    'Friendly',
    'Safe driving',
  ];

  const toggleTip = (tip: string) => {
    setSelectedTips(prev =>
      prev.includes(tip) ? prev.filter(t => t !== tip) : [...prev, tip]
    );
  };

  const handleSubmit = () => {
    // TODO: Submit rating to API
    router.push('/dashboard/rider');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A1D29] via-[#101828] to-[#1A1D29]">
      {/* Header */}
      <div className="px-6 pt-[27px] pb-6">
        <button
          onClick={() => router.push('/dashboard/rider')}
          className="w-[45px] h-[45px] bg-white/[0.00001] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1)] rounded-full flex items-center justify-center mb-6"
        >
          <ArrowLeft className="w-[27px] h-[27px] text-[#D1D5DC]" strokeWidth={2.25} />
        </button>

        <h1 className="text-2xl font-medium text-white mb-2">Rate Your Ride</h1>
        <p className="text-lg text-[#99A1AF]">How was your experience?</p>
      </div>

      {/* Rating */}
      <div className="px-6 pb-8">
        <div className="bg-gradient-to-br from-[#1E2939] to-[#101828] border border-white/10 rounded-[27px] p-8 text-center mb-6">
          <div className="flex justify-center gap-4 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className="transition-transform hover:scale-110"
              >
                <Star
                  className={`w-12 h-12 ${
                    star <= rating
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-[#364153]'
                  }`}
                  strokeWidth={2}
                />
              </button>
            ))}
          </div>
          {rating > 0 && (
            <p className="text-[#99A1AF]">
              {rating === 5 && 'Excellent!'}
              {rating === 4 && 'Great!'}
              {rating === 3 && 'Good'}
              {rating === 2 && 'Fair'}
              {rating === 1 && 'Needs Improvement'}
            </p>
          )}
        </div>

        {/* Quick Tips */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">Quick Tags</h3>
          <div className="flex flex-wrap gap-3">
            {QUICK_TIPS.map((tip) => (
              <button
                key={tip}
                onClick={() => toggleTip(tip)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedTips.includes(tip)
                    ? 'bg-[#DC143C] text-white'
                    : 'bg-[#1E2939] border-2 border-[#364153] text-[#D1D5DC]'
                }`}
              >
                {tip}
              </button>
            ))}
          </div>
        </div>

        {/* Comment */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">Additional Comments (Optional)</h3>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share more about your experience..."
            className="w-full h-32 bg-[#1E2939] border-2 border-[#364153] rounded-[18px] p-4 text-white placeholder:text-white/60 focus:border-[#DC143C] focus:outline-none resize-none"
          />
        </div>

        {/* Submit */}
        <Button
          variant="primary"
          className="w-full"
          onClick={handleSubmit}
          disabled={rating === 0}
        >
          Submit Rating
        </Button>

        <button
          onClick={() => router.push('/dashboard/rider')}
          className="w-full mt-4 text-[#99A1AF] hover:text-white transition-colors"
        >
          Skip for now
        </button>
      </div>
    </div>
  );
}
