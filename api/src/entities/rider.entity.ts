export class Rider {
  riderId: number;
  userId: number;
  defaultPickupLocation: string;
  loyaltyPoints: number;
  paymentMethod: string;
  preferredDriver: string;

  constructor(partial: Partial<Rider>) {
    Object.assign(this, partial);
  }
}
