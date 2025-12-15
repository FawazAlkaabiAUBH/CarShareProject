export class Ride {
  rideId: number;
  userId: number;
  vehicleId: number;
  origin: string;
  destination: string;
  originLat: number;
  originLng: number;
  destinationLat: number;
  destinationLng: number;
  distance?: number; // Calculated distance in km
  estimatedDuration?: number; // Estimated duration in minutes
  departureTime: Date;
  arrivalTime: Date | null;
  rideStatus: 'OPEN' | 'AVAILABLE' | 'BOOKED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  baseFare: number;
  distanceFare: number;
  serviceFee: number;
  totalFare: number;
  driverEarnings: number; // Total fare minus service fee
  farePerSeat: number;
  availableSeats: number;
  totalSeats: number;
  safetyCode?: string; // 4-digit safety code
  isRecurring: boolean; // Whether this is a scheduled/recurring ride
  recurringSchedule?: string; // JSON string with recurring details (days, times)
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<Ride>) {
    Object.assign(this, partial);
  }
}
