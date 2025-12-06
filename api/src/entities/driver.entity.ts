export class Driver {
  driverId: number;
  userId: number;
  vehicleInfo: string;
  licenseNumber: string;
  rating: number;
  totalRides: number;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<Driver>) {
    Object.assign(this, partial);
  }
}
