import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import Database from 'better-sqlite3';
import { join } from 'path';
import * as bcrypt from 'bcrypt';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private db: Database.Database;

  onModuleInit() {
    // Create database file in api directory
    const dbPath = join(process.cwd(), 'data.db');
    this.db = new Database(dbPath);
    this.db.pragma('journal_mode = WAL');
    this.initializeTables();
    this.seedData();
  }

  onModuleDestroy() {
    this.db.close();
  }

  getDatabase(): Database.Database {
    return this.db;
  }

  private initializeTables() {
    // Users table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        userId INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        phoneNumber TEXT,
        role TEXT NOT NULL CHECK(role IN ('DRIVER', 'RIDER', 'ADMIN')),
        accountStatus TEXT NOT NULL CHECK(accountStatus IN ('ACTIVE', 'INACTIVE', 'SUSPENDED')),
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        lastLogin TEXT
      )
    `);

    // Drivers table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS drivers (
        driverId INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL UNIQUE,
        vehicleInfo TEXT NOT NULL,
        licenseNumber TEXT NOT NULL,
        rating REAL DEFAULT 0,
        totalRides INTEGER DEFAULT 0,
        isVerified INTEGER DEFAULT 0,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        FOREIGN KEY (userId) REFERENCES users(userId) ON DELETE CASCADE
      )
    `);

    // Riders table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS riders (
        riderId INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL UNIQUE,
        preferredPickupLocation TEXT,
        rating REAL DEFAULT 0,
        totalRides INTEGER DEFAULT 0,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        FOREIGN KEY (userId) REFERENCES users(userId) ON DELETE CASCADE
      )
    `);

    // Rides table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS rides (
        rideId INTEGER PRIMARY KEY AUTOINCREMENT,
        driverId INTEGER NOT NULL,
        riderId INTEGER,
        pickupLocation TEXT NOT NULL,
        dropoffLocation TEXT NOT NULL,
        pickupTime TEXT NOT NULL,
        dropoffTime TEXT,
        rideStatus TEXT NOT NULL CHECK(rideStatus IN ('AVAILABLE', 'BOOKED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED')),
        fareEstimate REAL NOT NULL,
        availableSeats INTEGER NOT NULL,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        FOREIGN KEY (driverId) REFERENCES drivers(driverId) ON DELETE CASCADE,
        FOREIGN KEY (riderId) REFERENCES riders(riderId) ON DELETE SET NULL
      )
    `);

    // Bookings table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS bookings (
        bookingId INTEGER PRIMARY KEY AUTOINCREMENT,
        rideId INTEGER NOT NULL,
        riderId INTEGER NOT NULL,
        seatsBooked INTEGER NOT NULL,
        totalFare REAL NOT NULL,
        bookingStatus TEXT NOT NULL CHECK(bookingStatus IN ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED')),
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        FOREIGN KEY (rideId) REFERENCES rides(rideId) ON DELETE CASCADE,
        FOREIGN KEY (riderId) REFERENCES riders(riderId) ON DELETE CASCADE
      )
    `);

    // Ratings table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS ratings (
        ratingId INTEGER PRIMARY KEY AUTOINCREMENT,
        rideId INTEGER NOT NULL,
        raterId INTEGER NOT NULL,
        rateeId INTEGER NOT NULL,
        score INTEGER NOT NULL CHECK(score >= 1 AND score <= 5),
        comment TEXT,
        isFlagged INTEGER DEFAULT 0,
        feedbackTags TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        FOREIGN KEY (rideId) REFERENCES rides(rideId) ON DELETE CASCADE,
        FOREIGN KEY (raterId) REFERENCES users(userId) ON DELETE CASCADE,
        FOREIGN KEY (rateeId) REFERENCES users(userId) ON DELETE CASCADE
      )
    `);

    // Create indexes for better query performance
    this.db.exec(`
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
      CREATE INDEX IF NOT EXISTS idx_drivers_userId ON drivers(userId);
      CREATE INDEX IF NOT EXISTS idx_riders_userId ON riders(userId);
      CREATE INDEX IF NOT EXISTS idx_rides_driverId ON rides(driverId);
      CREATE INDEX IF NOT EXISTS idx_rides_status ON rides(rideStatus);
      CREATE INDEX IF NOT EXISTS idx_bookings_rideId ON bookings(rideId);
      CREATE INDEX IF NOT EXISTS idx_bookings_riderId ON bookings(riderId);
      CREATE INDEX IF NOT EXISTS idx_ratings_rideId ON ratings(rideId);
    `);
  }

  private seedData() {
    // Check if data already exists
    const userCount = this.db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };
    if (userCount.count > 0) {
      return; // Data already seeded
    }

    const now = new Date().toISOString();
    // Default password for all test users: "password123"
    const hashedPassword = bcrypt.hashSync('password123', 10);

    // Seed users
    const insertUser = this.db.prepare(`
      INSERT INTO users (name, email, password, phoneNumber, role, accountStatus, createdAt, updatedAt, lastLogin)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertUser.run('Ahmed Ali', 'ahmed@student.aubh.edu.bh', hashedPassword, '+973-12345678', 'DRIVER', 'ACTIVE', now, now, now);
    insertUser.run('Fatima Hassan', 'fatima@student.aubh.edu.bh', hashedPassword, '+973-23456789', 'RIDER', 'ACTIVE', now, now, now);
    insertUser.run('Mohammed Khalid', 'mohammed@student.aubh.edu.bh', hashedPassword, '+973-34567890', 'DRIVER', 'ACTIVE', now, now, now);

    // Seed drivers
    const insertDriver = this.db.prepare(`
      INSERT INTO drivers (userId, vehicleInfo, licenseNumber, rating, totalRides, isVerified, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertDriver.run(1, 'Toyota Camry 2020 - White', 'DL12345', 4.5, 0, 1, now, now);
    insertDriver.run(3, 'Honda Accord 2019 - Black', 'DL67890', 4.8, 0, 1, now, now);

    // Seed rider
    const insertRider = this.db.prepare(`
      INSERT INTO riders (userId, preferredPickupLocation, rating, totalRides, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    insertRider.run(2, 'Seef District', 4.7, 0, now, now);

    // Seed a ride for tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(8, 0, 0, 0);

    const insertRide = this.db.prepare(`
      INSERT INTO rides (driverId, riderId, pickupLocation, dropoffLocation, pickupTime, dropoffTime, rideStatus, fareEstimate, availableSeats, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertRide.run(1, null, 'Seef District', 'AUBH Campus', tomorrow.toISOString(), null, 'AVAILABLE', 2.5, 3, now, now);
  }
}
