export class Driver {
  driverId: number;
  userId: number;
  licenseNumber: string;
  vehicleInfo: string;
  vehiclePlate: string;
  vehicleType: string;
  availabilityStatus: 'AVAILABLE' | 'BUSY' | 'OFFLINE';
  totalRidesPosted: number;
  averageRating: number;

  constructor(partial: Partial<Driver>) {
    Object.assign(this, partial);
  }
}
