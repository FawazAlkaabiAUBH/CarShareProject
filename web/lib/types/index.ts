// ============= Core User Types =============
export interface User {
  userId: number;
  name: string;
  email: string;
  phoneNumber?: string;
  aubhId?: string;
  gender?: 'MALE' | 'FEMALE';
  role: 'DRIVER' | 'RIDER' | 'ADMIN';
  accountStatus: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  rating?: number;
  totalRides?: number;
  isVerified?: boolean;
  emergencyContacts?: EmergencyContact[];
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
  thisWeekRides?: number;
  totalEarned?: number;
  isVerified: boolean;
  car?: Car;
  createdAt?: string;
  updatedAt?: string;
}

export interface Rider {
  riderId: number;
  userId: number;
  preferredPickupLocation?: string;
  rating: number;
  totalRides: number;
  totalSpent?: number;
  createdAt?: string;
  updatedAt?: string;
}

// ============= Car Types =============
export interface Car {
  carId?: number;
  make: string;
  model: string;
  year: number;
  color: string;
  licensePlate: string;
}

// ============= Ride Types =============
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
  driverEarnings?: number;
  farePerSeat?: number;
  availableSeats: number;
  totalSeats: number;
  safetyCode?: string;
  rideStatus: 'OPEN' | 'AVAILABLE' | 'BOOKED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  isRecurring?: boolean;
  createdAt?: string;
  updatedAt?: string;
  driver?: User;
  rider?: User;
  car?: Car;
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
  totalFare?: number;
  serviceFee?: number;
  driverEarnings?: number;
  bookingStatus: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  cancellationReason?: string;
  cancelledBy?: number;
  completedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  ride?: Ride;
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

// ============= Notification Types =============
export interface Notification {
  id: number;
  userId: number;
  type: 'MATCH' | 'PAYMENT' | 'MESSAGE' | 'RIDE_COMPLETED' | 'RIDE_CANCELLED' | 'SYSTEM';
  title: string;
  body: string;
  relatedRideId?: number;
  relatedUserId?: number;
  isRead: boolean;
  createdAt: string;
}

// ============= Chat Types =============
export interface Message {
  id: number;
  rideId: number;
  fromUserId: number;
  toUserId: number;
  text: string;
  sentAt: string;
  isRead: boolean;
}

export interface ChatConversation {
  rideId: number;
  otherUser: User;
  messages: Message[];
  safetyCode?: string;
}

// ============= Safety Types =============
export interface EmergencyContact {
  id: number;
  name: string;
  phone: string;
  type: 'CAMPUS_SECURITY' | 'POLICE' | 'AMBULANCE' | 'PERSONAL';
}

// ============= Payment Types =============
export interface PaymentMethod {
  id: string;
  type: 'CASH' | 'BENEFITPAY';
  label: string;
  phone?: string;
  isDefault?: boolean;
}

export interface Transaction {
  id: string;
  rideId: number;
  amount: number;
  paymentMethod: PaymentMethod;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  transactionId?: string;
  createdAt: string;
}

// ============= Settings Types =============
export interface UserSettings {
  userId: number;
  notifications: boolean;
  darkMode: boolean;
  language: 'en' | 'ar';
}

// ============= Auth Types =============
export interface LoginCredentials {
  emailOrPhone: string;
  password: string;
}

export interface SignupData {
  gender: 'MALE' | 'FEMALE';
  aubhId: string;
  email: string;
  name: string;
  phoneNumber: string;
  password: string;
}

export interface VerificationData {
  emailOrPhone: string;
  code: string;
}

// ============= Location Types =============
export interface Location {
  address: string;
  lat: number;
  lng: number;
}

// ============= Match Types =============
export interface DriverMatch {
  driver: User & { car: Car };
  ride: Ride;
  matchPercentage: number;
  estimatedEarnings: number;
  distance: number;
}

export interface RiderMatch {
  rider: User;
  booking: Booking;
  pickupLocation: Location;
  destination: Location;
  distance: number;
  passengers: number;
}
