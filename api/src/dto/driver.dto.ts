export class RegisterDriverDto {
  userId: number;
  licenseNumber: string;
  vehicleInfo?: string;
  vehiclePlate?: string;
  vehicleType?: string;
  vehicleModel?: string;
  vehiclePlateNumber?: string;
  vehicleColor?: string;
}

export class UpdateDriverDto {
  vehicleInfo?: string;
  vehiclePlate?: string;
  vehicleType?: string;
  vehicleModel?: string;
  vehiclePlateNumber?: string;
  vehicleColor?: string;
  availabilityStatus?: 'AVAILABLE' | 'BUSY' | 'OFFLINE';
}
