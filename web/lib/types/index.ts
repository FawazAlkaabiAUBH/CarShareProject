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
  userId: number; // Driver's userId
  vehicleId: number;
  origin: string;
  destination: string;
  originLat: number;
  originLng: number;
  destinationLat: number;
  destinationLng: number;
  departureTime: string;
  estimatedArrivalTime?: string;
  estimatedDuration?: number;
  distance?: number;
  baseFare?: number;
  distanceFare?: number;
  serviceFee?: number;
  totalFare?: number;
  driverEarnings?: number; // Total fare minus service fee
  farePerSeat?: number;
  availableSeats: number;
  totalSeats: number;
  safetyCode?: string; // 4-digit safety code
  rideStatus: 'AVAILABLE' | 'BOOKED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  createdAt?: string;
  updatedAt?: string;
}

export interface Booking {
  bookingId: number;
  rideId: number;
  userId: number;
  seatsBooked: number;
  paymentMethod?: 'CASH' | 'BENEFITPAY';
  benefitPayPhone?: string;
  farePerSeat?: number;
  totalAmount?: number;
  totalFare?: number; // Backward compatibility
  serviceFee?: number;
  driverEarnings?: number;
  bookingStatus: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  cancellationReason?: string;
  cancelledBy?: number;
  completedAt?: string;
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
