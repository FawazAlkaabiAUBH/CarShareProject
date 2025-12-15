import { Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class UserRepository {
  constructor(private readonly db: DatabaseService) {}

  findById(userId: number): User | undefined {
    const row = this.db
      .getDatabase()
      .prepare('SELECT * FROM users WHERE userId = ?')
      .get(userId) as any;

    return row ? this.mapToEntity(row) : undefined;
  }

  findByEmail(email: string): User | undefined {
    const row = this.db
      .getDatabase()
      .prepare('SELECT * FROM users WHERE email = ?')
      .get(email) as any;

    return row ? this.mapToEntity(row) : undefined;
  }

  findByPhone(phoneNumber: string): User | undefined {
    const row = this.db
      .getDatabase()
      .prepare('SELECT * FROM users WHERE phoneNumber = ?')
      .get(phoneNumber) as any;

    return row ? this.mapToEntity(row) : undefined;
  }

  findByEmailOrPhone(emailOrPhone: string): User | undefined {
    const row = this.db
      .getDatabase()
      .prepare('SELECT * FROM users WHERE email = ? OR phoneNumber = ?')
      .get(emailOrPhone, emailOrPhone) as any;

    return row ? this.mapToEntity(row) : undefined;
  }

  findByRole(role: string): User[] {
    const rows = this.db
      .getDatabase()
      .prepare('SELECT * FROM users WHERE role = ?')
      .all(role) as any[];

    return rows.map((row) => this.mapToEntity(row));
  }

  search(nameOrEmail: string): User[] {
    const searchTerm = `%${nameOrEmail}%`;
    const rows = this.db
      .getDatabase()
      .prepare(
        'SELECT * FROM users WHERE name LIKE ? OR email LIKE ? COLLATE NOCASE',
      )
      .all(searchTerm, searchTerm) as any[];

    return rows.map((row) => this.mapToEntity(row));
  }

  save(user: Partial<User>): User {
    const now = new Date().toISOString();

    if (!user.userId) {
      // Insert new user
      const stmt = this.db.getDatabase().prepare(`
        INSERT INTO users (name, email, password, phoneNumber, aubhId, gender, benefitPayPhone, role, accountStatus, 
                          verificationCode, verificationCodeExpiry, isVerified, createdAt, updatedAt, lastLogin)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      const info = stmt.run(
        user.name,
        user.email,
        user.password,
        user.phoneNumber || null,
        user.aubhId || null,
        user.gender || null,
        user.benefitPayPhone || null,
        user.role,
        user.accountStatus || 'ACTIVE',
        user.verificationCode || null,
        user.verificationCodeExpiry?.toISOString() || null,
        user.isVerified ? 1 : 0,
        now,
        now,
        user.lastLogin?.toISOString() || null,
      );

      return this.findById(info.lastInsertRowid as number)!;
    } else {
      // Update existing user
      const stmt = this.db.getDatabase().prepare(`
        UPDATE users
        SET name = ?, email = ?, phoneNumber = ?, aubhId = ?, gender = ?, benefitPayPhone = ?, 
            role = ?, accountStatus = ?, verificationCode = ?, verificationCodeExpiry = ?, 
            isVerified = ?, updatedAt = ?, lastLogin = ?
        WHERE userId = ?
      `);

      stmt.run(
        user.name,
        user.email,
        user.phoneNumber || null,
        user.aubhId || null,
        user.gender || null,
        user.benefitPayPhone || null,
        user.role,
        user.accountStatus,
        user.verificationCode || null,
        user.verificationCodeExpiry?.toISOString() || null,
        user.isVerified ? 1 : 0,
        now,
        user.lastLogin?.toISOString() || null,
        user.userId,
      );

      return this.findById(user.userId)!;
    }
  }

  delete(userId: number): void {
    this.db
      .getDatabase()
      .prepare('DELETE FROM users WHERE userId = ?')
      .run(userId);
  }

  exists(userId: number): boolean {
    const row = this.db
      .getDatabase()
      .prepare('SELECT 1 FROM users WHERE userId = ?')
      .get(userId);

    return !!row;
  }

  updateLastLogin(userId: number, at: Date): void {
    this.db
      .getDatabase()
      .prepare('UPDATE users SET lastLogin = ?, updatedAt = ? WHERE userId = ?')
      .run(at.toISOString(), new Date().toISOString(), userId);
  }

  updateStatus(userId: number, status: string): void {
    this.db
      .getDatabase()
      .prepare(
        'UPDATE users SET accountStatus = ?, updatedAt = ? WHERE userId = ?',
      )
      .run(status, new Date().toISOString(), userId);
  }

  setVerificationCode(userId: number, code: string, expiry: Date): void {
    this.db
      .getDatabase()
      .prepare(
        'UPDATE users SET verificationCode = ?, verificationCodeExpiry = ?, updatedAt = ? WHERE userId = ?',
      )
      .run(code, expiry.toISOString(), new Date().toISOString(), userId);
  }

  verifyUser(userId: number): void {
    this.db
      .getDatabase()
      .prepare(
        'UPDATE users SET isVerified = 1, verificationCode = NULL, verificationCodeExpiry = NULL, updatedAt = ? WHERE userId = ?',
      )
      .run(new Date().toISOString(), userId);
  }

  findAll(): User[] {
    const rows = this.db
      .getDatabase()
      .prepare('SELECT * FROM users')
      .all() as any[];

    return rows.map((row) => this.mapToEntity(row));
  }

  private mapToEntity(row: any): User {
    return new User({
      userId: row.userId,
      name: row.name,
      email: row.email,
      password: row.password,
      phoneNumber: row.phoneNumber,
      aubhId: row.aubhId,
      gender: row.gender,
      benefitPayPhone: row.benefitPayPhone,
      role: row.role,
      accountStatus: row.accountStatus,
      verificationCode: row.verificationCode,
      verificationCodeExpiry: row.verificationCodeExpiry ? new Date(row.verificationCodeExpiry) : undefined,
      isVerified: Boolean(row.isVerified),
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt),
      lastLogin: row.lastLogin ? new Date(row.lastLogin) : undefined,
    });
  }
}
