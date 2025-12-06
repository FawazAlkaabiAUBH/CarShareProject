export class CreateUserDto {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  role: 'RIDER' | 'DRIVER';
}

export class UpdateUserDto {
  name?: string;
  email?: string;
  phoneNumber?: string;
}
