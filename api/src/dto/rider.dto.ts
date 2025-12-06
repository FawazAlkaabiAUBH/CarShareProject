export class RegisterRiderDto {
  userId: number;
  defaultPickupLocation: string;
  paymentMethod: string;
}

export class UpdateRiderDto {
  defaultPickupLocation?: string;
  paymentMethod?: string;
  preferredDriver?: string;
}
