export class Vehicle {
  vehicleId: number;
  userId: number;
  make: string;
  model: string;
  year: number;
  color: string;
  licensePlate: string;
  vehicleDocument?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<Vehicle>) {
    Object.assign(this, partial);
  }
}
