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
    // Users table - role is now for permission level (USER, ADMIN)
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        userId INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        phoneNumber TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'USER' CHECK(role IN ('USER', 'ADMIN')),
        accountStatus TEXT NOT NULL CHECK(accountStatus IN ('ACTIVE', 'INACTIVE', 'SUSPENDED')),
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        lastLogin TEXT
      )
    `);

    // Drivers table - simplified, no riderId/driverId, just userId
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS drivers (
        userId INTEGER PRIMARY KEY,
        licenseNumber TEXT NOT NULL,
        licenseDocument TEXT,
        isVerified INTEGER DEFAULT 0,
        verifiedAt TEXT,
        verifiedBy INTEGER,
        rating REAL DEFAULT 5.0,
        totalRides INTEGER DEFAULT 0,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        FOREIGN KEY (userId) REFERENCES users(userId) ON DELETE CASCADE,
        FOREIGN KEY (verifiedBy) REFERENCES users(userId) ON DELETE SET NULL
      )
    `);

    // New Vehicles table (normalized)
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS vehicles (
        vehicleId INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL,
        make TEXT NOT NULL,
        model TEXT NOT NULL,
        year INTEGER NOT NULL,
        color TEXT NOT NULL,
        plateNumber TEXT NOT NULL UNIQUE,
        vehicleDocument TEXT,
        isActive INTEGER DEFAULT 1,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        FOREIGN KEY (userId) REFERENCES users(userId) ON DELETE CASCADE
      )
    `);

    // Riders table - simplified
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS riders (
        userId INTEGER PRIMARY KEY,
        preferredPickupLocation TEXT,
        rating REAL DEFAULT 5.0,
        totalRides INTEGER DEFAULT 0,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        FOREIGN KEY (userId) REFERENCES users(userId) ON DELETE CASCADE
      )
    `);

    // Rides table - updated to use vehicleId
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS rides (
        rideId INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL,
        vehicleId INTEGER NOT NULL,
        pickupLocation TEXT NOT NULL,
        dropoffLocation TEXT NOT NULL,
        pickupTime TEXT NOT NULL,
        dropoffTime TEXT,
        rideStatus TEXT NOT NULL CHECK(rideStatus IN ('AVAILABLE', 'BOOKED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED')),
        farePerSeat REAL NOT NULL,
        availableSeats INTEGER NOT NULL,
        totalSeats INTEGER NOT NULL,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        FOREIGN KEY (userId) REFERENCES drivers(userId) ON DELETE CASCADE,
        FOREIGN KEY (vehicleId) REFERENCES vehicles(vehicleId) ON DELETE CASCADE
      )
    `);

    // Bookings table - simplified
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS bookings (
        bookingId INTEGER PRIMARY KEY AUTOINCREMENT,
        rideId INTEGER NOT NULL,
        userId INTEGER NOT NULL,
        seatsBooked INTEGER NOT NULL DEFAULT 1,
        totalFare REAL NOT NULL,
        bookingStatus TEXT NOT NULL CHECK(bookingStatus IN ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED')),
        cancellationReason TEXT,
        cancelledBy INTEGER,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        completedAt TEXT,
        FOREIGN KEY (rideId) REFERENCES rides(rideId) ON DELETE CASCADE,
        FOREIGN KEY (userId) REFERENCES riders(userId) ON DELETE CASCADE,
        FOREIGN KEY (cancelledBy) REFERENCES users(userId) ON DELETE SET NULL
      )
    `);

    // Ratings table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS ratings (
        ratingId INTEGER PRIMARY KEY AUTOINCREMENT,
        rideId INTEGER NOT NULL,
        raterUserId INTEGER NOT NULL,
        ratedUserId INTEGER NOT NULL,
        score INTEGER NOT NULL CHECK(score >= 1 AND score <= 5),
        comment TEXT,
        isFlagged INTEGER DEFAULT 0,
        feedbackTags TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        FOREIGN KEY (rideId) REFERENCES rides(rideId) ON DELETE CASCADE,
        FOREIGN KEY (raterUserId) REFERENCES users(userId) ON DELETE CASCADE,
        FOREIGN KEY (ratedUserId) REFERENCES users(userId) ON DELETE CASCADE
      )
    `);

    // Create indexes for better query performance
    this.db.exec(`
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
      CREATE INDEX IF NOT EXISTS idx_drivers_userId ON drivers(userId);
      CREATE INDEX IF NOT EXISTS idx_drivers_isVerified ON drivers(isVerified);
      CREATE INDEX IF NOT EXISTS idx_vehicles_userId ON vehicles(userId);
      CREATE INDEX IF NOT EXISTS idx_vehicles_isActive ON vehicles(isActive);
      CREATE INDEX IF NOT EXISTS idx_riders_userId ON riders(userId);
      CREATE INDEX IF NOT EXISTS idx_rides_userId ON rides(userId);
      CREATE INDEX IF NOT EXISTS idx_rides_vehicleId ON rides(vehicleId);
      CREATE INDEX IF NOT EXISTS idx_rides_status ON rides(rideStatus);
      CREATE INDEX IF NOT EXISTS idx_bookings_rideId ON bookings(rideId);
      CREATE INDEX IF NOT EXISTS idx_bookings_userId ON bookings(userId);
      CREATE INDEX IF NOT EXISTS idx_ratings_rideId ON ratings(rideId);
    `);
  }

  private seedData() {
    // Check if data already exists
    const userCount = this.db
      .prepare('SELECT COUNT(*) as count FROM users')
      .get() as { count: number };
    if (userCount.count > 0) {
      return; // Data already seeded
    }

    const now = new Date().toISOString();
    // Default password for all test users: "password123"
    const hashedPassword = bcrypt.hashSync('password123', 10);

    // Seed users (role is now USER or ADMIN, not DRIVER/RIDER)
    const insertUser = this.db.prepare(`
      INSERT INTO users (name, email, password, phoneNumber, role, accountStatus, createdAt, updatedAt, lastLogin)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    // User 1: Ahmed - Admin and Driver
    insertUser.run(
      'Ahmed Ali',
      'ahmed@aubh.edu.bh',
      hashedPassword,
      '+973-1234-5678',
      'ADMIN',
      'ACTIVE',
      now,
      now,
      now,
    );
    
    // User 2: Fatima - Regular user (rider)
    insertUser.run(
      'Fatima Hassan',
      'fatima@aubh.edu.bh',
      hashedPassword,
      '+973-2345-6789',
      'USER',
      'ACTIVE',
      now,
      now,
      now,
    );
    
    // User 3: Mohammed - Regular user and driver
    insertUser.run(
      'Mohammed Khalid',
      'mohammed@aubh.edu.bh',
      hashedPassword,
      '+973-3456-7890',
      'USER',
      'ACTIVE',
      now,
      now,
      now,
    );

    // Seed drivers (simplified - using userId directly)
    const insertDriver = this.db.prepare(`
      INSERT INTO drivers (userId, licenseNumber, isVerified, rating, totalRides, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    insertDriver.run(1, 'DL12345', 1, 4.5, 0, now, now); // Ahmed - verified
    insertDriver.run(3, 'DL67890', 1, 4.8, 0, now, now); // Mohammed - verified

    // Seed vehicles
    const insertVehicle = this.db.prepare(`
      INSERT INTO vehicles (userId, make, model, year, color, plateNumber, isActive, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertVehicle.run(1, 'Toyota', 'Camry', 2020, 'White', 'BH-12345', 1, now, now);
    insertVehicle.run(3, 'Honda', 'Accord', 2019, 'Black', 'BH-67890', 1, now, now);

    // Seed riders (everyone can be a rider)
    const insertRider = this.db.prepare(`
      INSERT INTO riders (userId, preferredPickupLocation, rating, totalRides, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    insertRider.run(1, 'Manama City', 5.0, 0, now, now); // Ahmed
    insertRider.run(2, 'Seef District', 4.7, 0, now, now); // Fatima
    insertRider.run(3, 'Riffa', 5.0, 0, now, now); // Mohammed

    // Seed a ride for tomorrow (using new schema with vehicleId and userId)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(8, 0, 0, 0);

    const insertRide = this.db.prepare(`
      INSERT INTO rides (userId, vehicleId, pickupLocation, dropoffLocation, pickupTime, dropoffTime, rideStatus, farePerSeat, availableSeats, totalSeats, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertRide.run(
      1, // userId (Ahmed)
      1, // vehicleId (Ahmed's Toyota Camry)
      'Seef District',
      'AUBH Campus',
      tomorrow.toISOString(),
      null,
      'AVAILABLE',
      2.5,
      3,
      4,
      now,
      now,
    );
  }
}
