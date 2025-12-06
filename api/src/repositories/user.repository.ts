import { Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';

@Injectable()
export class UserRepository {
  private users: Map<number, User> = new Map();
  private currentId = 1;

  // Seed with some test data
  constructor() {
    this.seed();
  }

  private seed() {
    const testUsers = [
      new User({
        userId: 1,
        name: 'Ahmed Ali',
        email: 'ahmed@student.aubh.edu.bh',
        phoneNumber: '+973-12345678',
        role: 'DRIVER',
        accountStatus: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date(),
        lastLogin: new Date(),
      }),
      new User({
        userId: 2,
        name: 'Fatima Hassan',
        email: 'fatima@student.aubh.edu.bh',
        phoneNumber: '+973-23456789',
        role: 'RIDER',
        accountStatus: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date(),
        lastLogin: new Date(),
      }),
      new User({
        userId: 3,
        name: 'Mohammed Khalid',
        email: 'mohammed@student.aubh.edu.bh',
        phoneNumber: '+973-34567890',
        role: 'DRIVER',
        accountStatus: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date(),
        lastLogin: new Date(),
      }),
    ];

    testUsers.forEach((user) => {
      this.users.set(user.userId, user);
      this.currentId = Math.max(this.currentId, user.userId + 1);
    });
  }

  findById(userId: number): User | undefined {
    return this.users.get(userId);
  }

  findByEmail(email: string): User | undefined {
    return Array.from(this.users.values()).find((u) => u.email === email);
  }

  findByRole(role: string): User[] {
    return Array.from(this.users.values()).filter((u) => u.role === role);
  }

  search(nameOrEmail: string): User[] {
    const searchTerm = nameOrEmail.toLowerCase();
    return Array.from(this.users.values()).filter(
      (u) =>
        u.name.toLowerCase().includes(searchTerm) ||
        u.email.toLowerCase().includes(searchTerm),
    );
  }

  save(user: Partial<User>): User {
    if (!user.userId) {
      user.userId = this.currentId++;
      user.createdAt = new Date();
    }
    user.updatedAt = new Date();

    const fullUser = new User(user as User);
    this.users.set(fullUser.userId, fullUser);
    return fullUser;
  }

  delete(userId: number): void {
    this.users.delete(userId);
  }

  exists(userId: number): boolean {
    return this.users.has(userId);
  }

  updateLastLogin(userId: number, at: Date): void {
    const user = this.users.get(userId);
    if (user) {
      user.lastLogin = at;
      user.updatedAt = new Date();
    }
  }

  updateStatus(userId: number, status: User['accountStatus']): void {
    const user = this.users.get(userId);
    if (user) {
      user.accountStatus = status;
      user.updatedAt = new Date();
    }
  }

  findAll(): User[] {
    return Array.from(this.users.values());
  }
}
