'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { apiClient } from '@/lib/api';

const CAR_MAKES = ['Toyota', 'Nissan', 'Honda', 'Hyundai', 'Chevrolet', 'Ford'];
const COLORS = [
  { name: 'White', value: '#FFFFFF' },
  { name: 'Black', value: '#000000' },
  { name: 'Silver', value: '#C0C0C0' },
  { name: 'Red', value: '#DC143C' },
  { name: 'Blue', value: '#002D72' },
  { name: 'Green', value: '#228B22' },
];

export default function CarRegistrationPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    color: '',
    licensePlate: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await apiClient.post('/vehicles', formData);
      router.push('/dashboard/driver');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to register vehicle');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A1D29] via-[#101828] to-[#1A1D29]">
      {/* Header */}
      <div className="px-6 pt-[27px] pb-6">
        <button
          onClick={() => router.push('/dashboard/driver')}
          className="w-[45px] h-[45px] bg-white/[0.00001] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1)] rounded-full flex items-center justify-center mb-6"
        >
          <ArrowLeft className="w-[27px] h-[27px] text-[#D1D5DC]" strokeWidth={2.25} />
        </button>

        <h1 className="text-2xl font-medium text-white mb-2">Car Registration</h1>
        <p className="text-lg text-[#99A1AF]">Add your vehicle details to start offering rides</p>
      </div>

      {/* Form */}
      <div className="px-6 pb-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Car Make */}
          <div className="space-y-3">
            <label className="text-lg font-medium text-[#D1D5DC]">Car Make</label>
            <div className="grid grid-cols-3 gap-3">
              {CAR_MAKES.map((make) => (
                <button
                  key={make}
                  type="button"
                  onClick={() => setFormData({ ...formData, make })}
                  className={`px-4 py-3 rounded-[18px] text-sm font-medium transition-all ${
                    formData.make === make
                      ? 'bg-[#DC143C] text-white'
                      : 'bg-[#1E2939] border-2 border-[#364153] text-[#D1D5DC]'
                  }`}
                >
                  {make}
                </button>
              ))}
            </div>
            <Input
              type="text"
              value={formData.make}
              onChange={(e) => setFormData({ ...formData, make: e.target.value })}
              placeholder="Or type make"
              className="w-full h-[54px] bg-[#1E2939] border-2 border-[#364153] rounded-[18px] px-4 text-white"
              required
            />
          </div>

          {/* Model */}
          <div className="space-y-3">
            <label className="text-lg font-medium text-[#D1D5DC]">Model</label>
            <Input
              type="text"
              value={formData.model}
              onChange={(e) => setFormData({ ...formData, model: e.target.value })}
              placeholder="e.g., Camry, Altima"
              className="w-full h-[54px] bg-[#1E2939] border-2 border-[#364153] rounded-[18px] px-4 text-white"
              required
            />
          </div>

          {/* Year */}
          <div className="space-y-3">
            <label className="text-lg font-medium text-[#D1D5DC]">Year</label>
            <Input
              type="number"
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
              min="1990"
              max={new Date().getFullYear() + 1}
              className="w-full h-[54px] bg-[#1E2939] border-2 border-[#364153] rounded-[18px] px-4 text-white"
              required
            />
          </div>

          {/* Color */}
          <div className="space-y-3">
            <label className="text-lg font-medium text-[#D1D5DC]">Color</label>
            <div className="grid grid-cols-6 gap-3">
              {COLORS.map((color) => (
                <button
                  key={color.name}
                  type="button"
                  onClick={() => setFormData({ ...formData, color: color.name })}
                  className={`w-full aspect-square rounded-full border-4 transition-all ${
                    formData.color === color.name
                      ? 'border-[#DC143C] scale-110'
                      : 'border-white/20'
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          {/* License Plate */}
          <div className="space-y-3">
            <label className="text-lg font-medium text-[#D1D5DC]">License Plate</label>
            <Input
              type="text"
              value={formData.licensePlate}
              onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value.toUpperCase() })}
              placeholder="ABC 1234"
              className="w-full h-[54px] bg-[#1E2939] border-2 border-[#364153] rounded-[18px] px-4 text-white uppercase"
              required
            />
          </div>

          {/* Error */}
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-[18px] text-red-500 text-sm">
              {error}
            </div>
          )}

          {/* Submit */}
          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Vehicle'}
          </Button>
        </form>
      </div>

      {/* Dynamic Island */}
      <div className="fixed top-[25.5px] left-1/2 -translate-x-1/2 w-[126px] h-[31.5px] bg-black rounded-full z-50" />
    </div>
  );
}
