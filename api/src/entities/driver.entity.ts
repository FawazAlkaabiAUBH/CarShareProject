export class Driver {
  userId: number;
  licenseNumber: string;
  licenseDocument?: string;
  isVerified: boolean;
  verifiedAt?: Date;
  verifiedBy?: number;
  rating: number;
  totalRides: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<Driver>) {
    Object.assign(this, partial);
  }
}
