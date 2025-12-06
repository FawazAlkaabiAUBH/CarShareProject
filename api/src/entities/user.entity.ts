export class User {
  userId: number;
  name: string;
  email: string;
  password: string; // Hashed password
  phoneNumber: string;
  role: 'RIDER' | 'DRIVER'; // Simplified - user can be both
  accountStatus: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  createdAt: Date;
  updatedAt: Date;
  lastLogin: Date;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
