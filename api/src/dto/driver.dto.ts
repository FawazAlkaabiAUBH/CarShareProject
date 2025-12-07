export class RegisterDriverDto {
  userId: number;
  licenseNumber: string;
  licenseDocument?: string; // Base64 or file path
}

export class UpdateDriverDto {
  licenseNumber?: string;
  licenseDocument?: string; // Base64 or file path
}

export class VerifyDriverDto {
  userId: number;
  verifiedBy: number;
}
