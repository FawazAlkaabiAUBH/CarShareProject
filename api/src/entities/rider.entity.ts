export class Rider {
  riderId: number;
  userId: number;
  preferredPickupLocation: string;
  rating: number;
  totalRides: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<Rider>) {
    Object.assign(this, partial);
  }
}
