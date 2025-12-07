export class CreateVehicleDto {
  userId: number;
  make: string;
  model: string;
  year: number;
  color: string;
  plateNumber: string;
  vehicleDocument?: string;
}

export class UpdateVehicleDto {
  make?: string;
  model?: string;
  year?: number;
  color?: string;
  plateNumber?: string;
  vehicleDocument?: string;
  isActive?: boolean;
}
