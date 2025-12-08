'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { IconButton } from '@/components/ui/IconButton';
import { apiClient } from '@/lib/api';
import { ChevronLeft, User, CheckCircle, XCircle, Eye, Car } from 'lucide-react';

interface Driver {
  userId: number;
  licenseNumber: string;
  licenseDocument?: string;
  isVerified: boolean;
  user: {
    fullName: string;
    email: string;
    phoneNumber: string;
  };
  vehicles?: Array<{
    vehicleId: number;
    make: string;
    model: string;
    year: number;
    color: string;
    plateNumber: string;
    vehicleDocument?: string;
  }>;
}

export default function VerifyDriversPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ userId: number; role: string } | null>(null);
  const [pendingDrivers, setPendingDrivers] = useState<Driver[]>([]);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      
      // Check if user is admin
      if (parsedUser.role !== 'ADMIN') {
        router.push('/dashboard');
        return;
      }
      
      fetchPendingDrivers();
    }
  }, [router]);

  const fetchPendingDrivers = async () => {
    try {
      const response = await apiClient.get('/drivers');
      const unverified = response.data.filter((driver: Driver) => !driver.isVerified);
      setPendingDrivers(unverified);
    } catch (err) {
      setError('Failed to fetch pending drivers');
    }
  };

  const handleVerifyDriver = async (userId: number, approve: boolean) => {
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      if (approve) {
        // Use dedicated verify endpoint that handles both driver verification and vehicle activation
        await apiClient.put(`/drivers/user/${userId}/verify`);
        
        setSuccess('Driver approved successfully');
      } else {
        // Reject driver - delete driver profile and vehicles
        await apiClient.delete(`/drivers/user/${userId}`);
        setSuccess('Driver rejected');
      }
      
      // Refresh the list
      await fetchPendingDrivers();
      setSelectedDriver(null);
    } catch (err) {
      setError('Failed to update driver status');
    } finally {
      setLoading(false);
    }
  };

  const openDocument = (base64Data: string) => {
    // Open document in new tab
    const newWindow = window.open();
    if (newWindow) {
      newWindow.document.write(`<iframe src="${base64Data}" style="width:100%;height:100%;border:none;"></iframe>`);
    }
  };

  if (!user || user.role !== 'ADMIN') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0e1a] via-[#1a1d29] to-[#0a0e1a] pb-24">
      {/* Header */}
      <div className="bg-[#101828] border-b-2 border-white/10 p-6">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <IconButton
            icon={<ChevronLeft className="w-6 h-6 text-slate-300" />}
            onClick={() => selectedDriver ? setSelectedDriver(null) : router.back()}
          />
          <h1 className="text-xl font-medium text-white">
            {selectedDriver ? 'Driver Details' : 'Verify Drivers'}
          </h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="max-w-md mx-auto p-6 space-y-6">
        {/* Error/Success Messages */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-[18px] p-4">
            <p className="text-red-500 text-sm">{error}</p>
          </div>
        )}
        {success && (
          <div className="bg-green-500/10 border border-green-500/50 rounded-[18px] p-4">
            <p className="text-green-500 text-sm">{success}</p>
          </div>
        )}

        {/* Driver List View */}
        {!selectedDriver && (
          <>
            <Card variant="default">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-white">Pending Verifications</h2>
                <span className="px-3 py-1 bg-[#dc143c]/20 border border-[#dc143c] text-[#dc143c] rounded-full text-sm">
                  {pendingDrivers.length}
                </span>
              </div>
            </Card>

            {pendingDrivers.length === 0 ? (
              <Card variant="glass">
                <p className="text-center text-[#99a1af]">No pending driver verifications</p>
              </Card>
            ) : (
              pendingDrivers.map((driver) => (
                <Card 
                  key={driver.userId} 
                  variant="default"
                  className="cursor-pointer hover:bg-white/5"
                  onClick={() => setSelectedDriver(driver)}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-b from-[#dc143c] to-[#8b0000] rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-white">{driver.user.fullName}</h3>
                      <p className="text-[#99a1af] text-sm">{driver.user.email}</p>
                      <p className="text-[#99a1af] text-sm">License: {driver.licenseNumber}</p>
                    </div>
                    <Eye className="w-5 h-5 text-[#99a1af]" />
                  </div>
                </Card>
              ))
            )}
          </>
        )}

        {/* Driver Details View */}
        {selectedDriver && (
          <div className="space-y-6">
            {/* User Info */}
            <Card variant="default">
              <h3 className="text-lg font-medium text-white mb-4">Driver Information</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[#99a1af]">Name</span>
                  <span className="text-white">{selectedDriver.user.fullName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#99a1af]">Email</span>
                  <span className="text-white text-sm">{selectedDriver.user.email}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#99a1af]">Phone</span>
                  <span className="text-white">{selectedDriver.user.phoneNumber}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#99a1af]">License Number</span>
                  <span className="text-white">{selectedDriver.licenseNumber}</span>
                </div>
              </div>
            </Card>

            {/* Vehicles */}
            {selectedDriver.vehicles && selectedDriver.vehicles.length > 0 && (
              <Card variant="default">
                <h3 className="text-lg font-medium text-white mb-4">Vehicles</h3>
                <div className="space-y-3">
                  {selectedDriver.vehicles.map((vehicle) => (
                    <div key={vehicle.vehicleId} className="p-3 bg-white/5 rounded-[18px]">
                      <div className="flex items-center gap-3 mb-2">
                        <Car className="w-5 h-5 text-[#dc143c]" />
                        <div className="flex-1">
                          <p className="text-white">
                            {vehicle.make} {vehicle.model} {vehicle.year}
                          </p>
                          <p className="text-[#99a1af] text-sm">
                            {vehicle.color} • {vehicle.plateNumber}
                          </p>
                        </div>
                      </div>
                      {vehicle.vehicleDocument && (
                        <Button
                          variant="secondary"
                          size="sm"
                          className="w-full mt-2"
                          onClick={() => openDocument(vehicle.vehicleDocument!)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Vehicle Document
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Documents */}
            <Card variant="default">
              <h3 className="text-lg font-medium text-white mb-4">License Documents</h3>
              <div className="space-y-3">
                {selectedDriver.licenseDocument && (
                  <Button
                    variant="secondary"
                    size="md"
                    className="w-full"
                    onClick={() => openDocument(selectedDriver.licenseDocument!)}
                  >
                    <Eye className="w-5 h-5 mr-2" />
                    View License Document
                  </Button>
                )}
                {!selectedDriver.licenseDocument && (
                  <p className="text-center text-[#99a1af] text-sm">No license document uploaded</p>
                )}
              </div>
            </Card>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                variant="primary"
                size="md"
                className="flex-1 bg-green-600 hover:bg-green-700"
                onClick={() => handleVerifyDriver(selectedDriver.userId, true)}
                disabled={loading}
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                Approve
              </Button>
              <Button
                variant="secondary"
                size="md"
                className="flex-1 bg-red-600 hover:bg-red-700 text-white border-red-600"
                onClick={() => handleVerifyDriver(selectedDriver.userId, false)}
                disabled={loading}
              >
                <XCircle className="w-5 h-5 mr-2" />
                Reject
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
