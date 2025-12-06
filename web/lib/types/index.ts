export interface User {
  userId: number;
  name: string;
  email: string;
  phoneNumber?: string;
  role: 'DRIVER' | 'RIDER' | 'ADMIN';
  accountStatus: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  createdAt?: string;
  updatedAt?: string;
  lastLogin?: string;
}

export interface Driver {
  driverId: number;
  userId: number;
  vehicleInfo: string;
  licenseNumber: string;
  rating: number;
  totalRides: number;
  isVerified: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Rider {
  riderId: number;
  userId: number;
  preferredPickupLocation?: string;
  rating: number;
  totalRides: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Ride {
  rideId: number;
  driverId: number;
  riderId?: number;
  pickupLocation: string;
  dropoffLocation: string;
  pickupTime: string;
  dropoffTime?: string;
  fareEstimate: number;
  availableSeats: number;
  rideStatus: 'AVAILABLE' | 'BOOKED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  createdAt?: string;
  updatedAt?: string;
}

export interface Booking {
  bookingId: number;
  rideId: number;
  riderId: number;
  seatsBooked: number;
  totalFare: number;
  bookingStatus: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  createdAt?: string;
  updatedAt?: string;
}

export interface Rating {
  ratingId: number;
  rideId: number;
  raterId: number;
  rateeId: number;
  score: number;
  comment?: string;
  isFlagged: boolean;
  feedbackTags?: string;
  createdAt?: string;
  updatedAt?: string;
}
