'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { IconButton } from '@/components/ui/IconButton';
import { apiClient } from '@/lib/api';
import { 
  ChevronLeft, 
  User, 
  Car, 
  List, 
  Settings as SettingsIcon,
  Edit2,
  Plus,
  Trash2,
  X
} from 'lucide-react';

interface User {
  userId: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: string;
  accountStatus: string;
}

interface Vehicle {
  vehicleId: number;
  make: string;
  model: string;
  year: number;
  color: string;
  plateNumber: string;
  isActive: boolean;
}

interface Booking {
  bookingId: number;
  ride: {
    rideId: number;
    origin: string;
    destination: string;
    departureTime: string;
    farePerSeat: number;
  };
  seatsBooked: number;
  totalFare: number;
  bookingStatus: string;
  createdAt: string;
}

type ActiveSection = 'overview' | 'edit' | 'vehicles' | 'history' | 'settings';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isDriver, setIsDriver] = useState(false);
  const [activeSection, setActiveSection] = useState<ActiveSection>('overview');
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Edit profile form
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Add vehicle form
  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [vehicleForm, setVehicleForm] = useState({
    make: '',
    model: '',
    year: '',
    color: '',
    plateNumber: '',
  });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setEditForm({
        name: parsedUser.fullName || parsedUser.name || '',
        email: parsedUser.email,
        phoneNumber: parsedUser.phoneNumber,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      
      // Fetch user's data
      checkDriverStatus(parsedUser.userId);
      fetchVehicles(parsedUser.userId);
      fetchBookings(parsedUser.userId);
    }
  }, []);

  const checkDriverStatus = async (userId: number) => {
    try {
      const response = await apiClient.get(`/drivers/user/${userId}/status`);
      setIsDriver(response.data.isDriver && response.data.isVerified);
    } catch {
      setIsDriver(false);
    }
  };

  const fetchVehicles = async (userId: number) => {
    try {
      const response = await apiClient.get('/vehicles/my');
      setVehicles(response.data);
    } catch (err) {
      console.error('Error fetching vehicles:', err);
    }
  };

  const fetchBookings = async (userId: number) => {
    try {
      const response = await apiClient.get(`/bookings/user/${userId}`);
      setBookings(response.data);
    } catch (err) {
      console.error('Error fetching bookings:', err);
    }
  };

  const handleUpdateProfile = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const updateData: Record<string, string> = {
        fullName: editForm.name,
        email: editForm.email,
        phoneNumber: editForm.phoneNumber,
      };

      if (editForm.newPassword) {
        if (editForm.newPassword !== editForm.confirmPassword) {
          setError('New passwords do not match');
          setLoading(false);
          return;
        }
        updateData.password = editForm.newPassword;
      }

      await apiClient.put(`/users/${user?.userId}`, updateData);
      
      const updatedUser = { ...user, fullName: editForm.name, email: editForm.email, phoneNumber: editForm.phoneNumber };
      setUser(updatedUser as User);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      setSuccess('Profile updated successfully');
      setEditForm({ ...editForm, currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleAddVehicle = async () => {
    setLoading(true);
    setError('');
    
    try {
      await apiClient.post('/vehicles', {
        userId: user?.userId,
        make: vehicleForm.make,
        model: vehicleForm.model,
        year: parseInt(vehicleForm.year),
        color: vehicleForm.color,
        plateNumber: vehicleForm.plateNumber,
      });
      
      setSuccess('Vehicle added successfully');
      setShowAddVehicle(false);
      setVehicleForm({ make: '', model: '', year: '', color: '', plateNumber: '' });
      if (user) fetchVehicles(user.userId);
    } catch (err) {
      setError('Failed to add vehicle');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVehicle = async (vehicleId: number) => {
    if (!confirm('Are you sure you want to delete this vehicle?')) return;
    
    try {
      await apiClient.delete(`/vehicles/${vehicleId}`);
      setSuccess('Vehicle deleted successfully');
      if (user) fetchVehicles(user.userId);
    } catch (err) {
      setError('Failed to delete vehicle');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('access_token');
    router.push('/');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0e1a] via-[#1a1d29] to-[#0a0e1a] pb-24">
      {/* Header */}
      <div className="bg-[#101828] border-b-2 border-white/10 p-6">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <IconButton
            icon={<ChevronLeft className="w-6 h-6 text-slate-300" />}
            onClick={() => activeSection === 'overview' ? router.back() : setActiveSection('overview')}
          />
          <h1 className="text-xl font-medium text-white">
            {activeSection === 'overview' && 'Profile'}
            {activeSection === 'edit' && 'Edit Profile'}
            {activeSection === 'vehicles' && 'My Vehicles'}
            {activeSection === 'history' && 'Ride History'}
            {activeSection === 'settings' && 'Settings'}
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

        {/* Overview Section */}
        {activeSection === 'overview' && (
          <>
            {/* Profile Header */}
            <Card variant="default">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-gradient-to-b from-[#dc143c] to-[#8b0000] rounded-full flex items-center justify-center">
                  <span className="text-3xl font-bold text-white">
                    {user.fullName?.charAt(0) || user.email.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-medium text-white">{user.fullName || 'User'}</h2>
                  <p className="text-[#99a1af]">{user.email}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="px-3 py-1 bg-[#dc143c]/20 border border-[#dc143c] text-[#dc143c] rounded-full text-xs">
                      {user.role}
                    </span>
                    <span className="px-3 py-1 bg-[#10b981]/20 border border-[#10b981] text-[#10b981] rounded-full text-xs">
                      {user.accountStatus}
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              <Card variant="glass">
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">{bookings.length}</p>
                  <p className="text-sm text-[#99a1af]">Bookings</p>
                </div>
              </Card>
              <Card variant="glass">
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">{vehicles.length}</p>
                  <p className="text-sm text-[#99a1af]">Vehicles</p>
                </div>
              </Card>
              <Card variant="glass">
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">0</p>
                  <p className="text-sm text-[#99a1af]">Reviews</p>
                </div>
              </Card>
            </div>

            {/* Menu Items */}
            <div className="space-y-3">
              <Card 
                variant="glass" 
                className="cursor-pointer hover:bg-white/10"
                onClick={() => setActiveSection('edit')}
              >
                <div className="flex items-center gap-3">
                  <User className="w-6 h-6 text-[#dc143c]" />
                  <span className="text-white">Edit Profile</span>
                </div>
              </Card>

              {isDriver && (
                <Card 
                  variant="glass" 
                  className="cursor-pointer hover:bg-white/10"
                  onClick={() => setActiveSection('vehicles')}
                >
                  <div className="flex items-center gap-3">
                    <Car className="w-6 h-6 text-[#dc143c]" />
                    <span className="text-white">My Vehicles</span>
                  </div>
                </Card>
              )}

              <Card 
                variant="glass" 
                className="cursor-pointer hover:bg-white/10"
                onClick={() => setActiveSection('history')}
              >
                <div className="flex items-center gap-3">
                  <List className="w-6 h-6 text-[#dc143c]" />
                  <span className="text-white">Ride History</span>
                </div>
              </Card>

              <Card 
                variant="glass" 
                className="cursor-pointer hover:bg-white/10"
                onClick={() => setActiveSection('settings')}
              >
                <div className="flex items-center gap-3">
                  <SettingsIcon className="w-6 h-6 text-[#dc143c]" />
                  <span className="text-white">Settings</span>
                </div>
              </Card>
            </div>

            {/* Logout Button */}
            <Button
              variant="secondary"
              size="md"
              className="w-full"
              onClick={handleLogout}
            >
              Logout
            </Button>

            <p className="text-center text-sm text-[#6a7282]">
              CarShare v1.0.0 • AUBH
            </p>
          </>
        )}

        {/* Edit Profile Section */}
        {activeSection === 'edit' && (
          <div className="space-y-6">
            <Card variant="default">
              <div className="space-y-4">
                <Input
                  type="text"
                  label="Full Name"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                />
                <Input
                  type="email"
                  label="Email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                />
                <Input
                  type="tel"
                  label="Phone Number"
                  value={editForm.phoneNumber}
                  onChange={(e) => setEditForm({ ...editForm, phoneNumber: e.target.value })}
                />
              </div>
            </Card>

            <Card variant="default">
              <h3 className="text-lg font-medium text-white mb-4">Change Password</h3>
              <div className="space-y-4">
                <Input
                  type="password"
                  label="New Password"
                  value={editForm.newPassword}
                  onChange={(e) => setEditForm({ ...editForm, newPassword: e.target.value })}
                  placeholder="Leave blank to keep current"
                />
                <Input
                  type="password"
                  label="Confirm New Password"
                  value={editForm.confirmPassword}
                  onChange={(e) => setEditForm({ ...editForm, confirmPassword: e.target.value })}
                />
              </div>
            </Card>

            <Button
              variant="primary"
              size="md"
              className="w-full"
              onClick={handleUpdateProfile}
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Save Changes'}
            </Button>
          </div>
        )}

        {/* My Vehicles Section */}
        {activeSection === 'vehicles' && (
          <div className="space-y-6">
            <Button
              variant="primary"
              size="md"
              className="w-full"
              onClick={() => setShowAddVehicle(!showAddVehicle)}
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Vehicle
            </Button>

            {showAddVehicle && (
              <Card variant="default">
                <h3 className="text-lg font-medium text-white mb-4">New Vehicle</h3>
                <div className="space-y-4">
                  <Input
                    type="text"
                    label="Make"
                    placeholder="Toyota"
                    value={vehicleForm.make}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, make: e.target.value })}
                  />
                  <Input
                    type="text"
                    label="Model"
                    placeholder="Camry"
                    value={vehicleForm.model}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, model: e.target.value })}
                  />
                  <Input
                    type="number"
                    label="Year"
                    placeholder="2020"
                    value={vehicleForm.year}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, year: e.target.value })}
                  />
                  <Input
                    type="text"
                    label="Color"
                    placeholder="Silver"
                    value={vehicleForm.color}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, color: e.target.value })}
                  />
                  <Input
                    type="text"
                    label="Plate Number"
                    placeholder="BH-12345"
                    value={vehicleForm.plateNumber}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, plateNumber: e.target.value })}
                  />
                  <div className="flex gap-3">
                    <Button
                      variant="primary"
                      size="md"
                      className="flex-1"
                      onClick={handleAddVehicle}
                      disabled={loading}
                    >
                      Add
                    </Button>
                    <Button
                      variant="secondary"
                      size="md"
                      className="flex-1"
                      onClick={() => setShowAddVehicle(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {vehicles.length === 0 ? (
              <Card variant="glass">
                <p className="text-center text-[#99a1af]">No vehicles added yet</p>
              </Card>
            ) : (
              vehicles.map((vehicle) => (
                <Card key={vehicle.vehicleId} variant="default">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-white">
                        {vehicle.make} {vehicle.model} {vehicle.year}
                      </h3>
                      <p className="text-[#99a1af] text-sm mt-1">
                        {vehicle.color} • {vehicle.plateNumber}
                      </p>
                      <div className="mt-2">
                        <span className={`px-3 py-1 rounded-full text-xs ${
                          vehicle.isActive 
                            ? 'bg-green-500/20 border border-green-500 text-green-500' 
                            : 'bg-gray-500/20 border border-gray-500 text-gray-500'
                        }`}>
                          {vehicle.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                    <IconButton
                      icon={<Trash2 className="w-5 h-5 text-red-500" />}
                      onClick={() => handleDeleteVehicle(vehicle.vehicleId)}
                    />
                  </div>
                </Card>
              ))
            )}
          </div>
        )}

        {/* Ride History Section */}
        {activeSection === 'history' && (
          <div className="space-y-6">
            {bookings.length === 0 ? (
              <Card variant="glass">
                <p className="text-center text-[#99a1af]">No bookings yet</p>
              </Card>
            ) : (
              bookings.map((booking) => (
                <Card key={booking.bookingId} variant="default">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-white">
                          {booking.ride.origin} → {booking.ride.destination}
                        </h3>
                        <p className="text-[#99a1af] text-sm mt-1">
                          {new Date(booking.ride.departureTime).toLocaleString()}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs ${
                        booking.bookingStatus === 'CONFIRMED' 
                          ? 'bg-green-500/20 border border-green-500 text-green-500' 
                          : booking.bookingStatus === 'PENDING'
                          ? 'bg-yellow-500/20 border border-yellow-500 text-yellow-500'
                          : 'bg-red-500/20 border border-red-500 text-red-500'
                      }`}>
                        {booking.bookingStatus}
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-white/10">
                      <span className="text-[#99a1af] text-sm">
                        {booking.seatsBooked} seat{booking.seatsBooked > 1 ? 's' : ''}
                      </span>
                      <span className="text-white font-medium">
                        BHD {booking.totalFare.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        )}

        {/* Settings Section */}
        {activeSection === 'settings' && (
          <div className="space-y-6">
            <Card variant="default">
              <h3 className="text-lg font-medium text-white mb-4">Account</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[#99a1af]">User ID</span>
                  <span className="text-white">{user.userId}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#99a1af]">Account Status</span>
                  <span className="text-white">{user.accountStatus}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#99a1af]">Role</span>
                  <span className="text-white">{user.role}</span>
                </div>
              </div>
            </Card>

            <Card variant="default">
              <h3 className="text-lg font-medium text-white mb-4">Privacy</h3>
              <p className="text-[#99a1af] text-sm">
                Your data is protected and used only for providing carpool services. 
                We do not share your information with third parties.
              </p>
            </Card>

            <Button
              variant="secondary"
              size="md"
              className="w-full text-red-500 border-red-500"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

