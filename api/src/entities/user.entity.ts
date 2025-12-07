export class User {
  userId: number;
  fullName: string;
  email: string;
  password: string; // Hashed password
  phoneNumber: string;
  role: 'USER' | 'ADMIN'; // Permission level
  accountStatus: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  createdAt: Date;
  updatedAt: Date;
  lastLogin: Date;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
