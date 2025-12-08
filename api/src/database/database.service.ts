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
    // Drop existing tables for clean schema update
    this.db.exec(`
      DROP TABLE IF EXISTS ratings;
      DROP TABLE IF EXISTS bookings;
      DROP TABLE IF EXISTS rides;
      DROP TABLE IF EXISTS notifications;
      DROP TABLE IF EXISTS vehicles;
      DROP TABLE IF EXISTS riders;
      DROP TABLE IF EXISTS drivers;
      DROP TABLE IF EXISTS system_settings;
      DROP TABLE IF EXISTS users;
    `);

    // Users table - role is now for permission level (USER, ADMIN)
    this.db.exec(`
      CREATE TABLE users (
        userId INTEGER PRIMARY KEY AUTOINCREMENT,
        fullName TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        phoneNumber TEXT NOT NULL,
        benefitPayPhone TEXT,
        role TEXT NOT NULL DEFAULT 'USER' CHECK(role IN ('USER', 'ADMIN')),
        accountStatus TEXT NOT NULL CHECK(accountStatus IN ('ACTIVE', 'INACTIVE', 'SUSPENDED')),
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        lastLogin TEXT
      )
    `);

    // Drivers table - simplified, no riderId/driverId, just userId
    this.db.exec(`
      CREATE TABLE drivers (
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
      CREATE TABLE vehicles (
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
      CREATE TABLE riders (
        userId INTEGER PRIMARY KEY,
        preferredPickupLocation TEXT,
        rating REAL DEFAULT 5.0,
        totalRides INTEGER DEFAULT 0,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        FOREIGN KEY (userId) REFERENCES users(userId) ON DELETE CASCADE
      )
    `);

    // Rides table - enhanced with location coordinates and fare breakdown
    this.db.exec(`
      CREATE TABLE rides (
        rideId INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL,
        vehicleId INTEGER NOT NULL,
        origin TEXT NOT NULL,
        destination TEXT NOT NULL,
        originLat REAL NOT NULL,
        originLng REAL NOT NULL,
        destinationLat REAL NOT NULL,
        destinationLng REAL NOT NULL,
        distance REAL,
        estimatedDuration INTEGER,
        departureTime TEXT NOT NULL,
        arrivalTime TEXT,
        rideStatus TEXT NOT NULL CHECK(rideStatus IN ('AVAILABLE', 'BOOKED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED')),
        baseFare REAL NOT NULL,
        distanceFare REAL NOT NULL,
        serviceFee REAL NOT NULL,
        totalFare REAL NOT NULL,
        driverEarnings REAL NOT NULL,
        farePerSeat REAL NOT NULL,
        availableSeats INTEGER NOT NULL,
        totalSeats INTEGER NOT NULL,
        safetyCode TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        FOREIGN KEY (userId) REFERENCES drivers(userId) ON DELETE CASCADE,
        FOREIGN KEY (vehicleId) REFERENCES vehicles(vehicleId) ON DELETE CASCADE
      )
    `);

    // Bookings table - enhanced with payment method and fare details
    this.db.exec(`
      CREATE TABLE bookings (
        bookingId INTEGER PRIMARY KEY AUTOINCREMENT,
        rideId INTEGER NOT NULL,
        userId INTEGER NOT NULL,
        seatsBooked INTEGER NOT NULL DEFAULT 1,
        paymentMethod TEXT NOT NULL CHECK(paymentMethod IN ('CASH', 'BENEFITPAY')),
        benefitPayPhone TEXT,
        farePerSeat REAL NOT NULL,
        totalAmount REAL NOT NULL,
        serviceFee REAL NOT NULL,
        driverEarnings REAL NOT NULL,
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
      CREATE TABLE ratings (
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

    // Notifications table - new table for in-app notifications
    this.db.exec(`
      CREATE TABLE notifications (
        notificationId INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL,
        type TEXT NOT NULL CHECK(type IN ('BOOKING_REQUEST', 'BOOKING_CONFIRMED', 'BOOKING_CANCELLED', 'RIDE_STARTED', 'RIDE_COMPLETED', 'DRIVER_VERIFIED', 'SYSTEM')),
        title TEXT NOT NULL,
        message TEXT NOT NULL,
        relatedEntityType TEXT,
        relatedEntityId INTEGER,
        isRead INTEGER DEFAULT 0,
        createdAt TEXT NOT NULL,
        FOREIGN KEY (userId) REFERENCES users(userId) ON DELETE CASCADE
      )
    `);

    // System settings table - configurable pricing
    this.db.exec(`
      CREATE TABLE system_settings (
        settingKey TEXT PRIMARY KEY,
        settingValue TEXT NOT NULL,
        description TEXT,
        updatedAt TEXT NOT NULL
      )
    `);

    // Create indexes for better query performance
    this.db.exec(`
      CREATE INDEX idx_users_email ON users(email);
      CREATE INDEX idx_users_role ON users(role);
      CREATE INDEX idx_drivers_userId ON drivers(userId);
      CREATE INDEX idx_drivers_isVerified ON drivers(isVerified);
      CREATE INDEX idx_vehicles_userId ON vehicles(userId);
      CREATE INDEX idx_vehicles_isActive ON vehicles(isActive);
      CREATE INDEX idx_riders_userId ON riders(userId);
      CREATE INDEX idx_rides_userId ON rides(userId);
      CREATE INDEX idx_rides_vehicleId ON rides(vehicleId);
      CREATE INDEX idx_rides_status ON rides(rideStatus);
      CREATE INDEX idx_rides_location ON rides(originLat, originLng);
      CREATE INDEX idx_bookings_rideId ON bookings(rideId);
      CREATE INDEX idx_bookings_userId ON bookings(userId);
      CREATE INDEX idx_ratings_rideId ON ratings(rideId);
      CREATE INDEX idx_notifications_userId ON notifications(userId);
      CREATE INDEX idx_notifications_isRead ON notifications(isRead);
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

    // Seed system settings with realistic Bahrain pricing
    const insertSetting = this.db.prepare(`
      INSERT INTO system_settings (settingKey, settingValue, description, updatedAt)
      VALUES (?, ?, ?, ?)
    `);

    insertSetting.run('BASE_FARE', '0.500', 'Base fare in BHD', now);
    insertSetting.run('FARE_PER_KM', '0.150', 'Fare per kilometer in BHD', now);
    insertSetting.run('SERVICE_FEE_PERCENTAGE', '10', 'Service fee percentage', now);
    insertSetting.run('MIN_FARE', '1.000', 'Minimum fare in BHD', now);
    insertSetting.run('CURRENCY_CODE', 'BHD', 'Currency code', now);

    // Seed users (role is now USER or ADMIN, not DRIVER/RIDER)
    const insertUser = this.db.prepare(`
      INSERT INTO users (fullName, email, password, phoneNumber, benefitPayPhone, role, accountStatus, createdAt, updatedAt, lastLogin)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    // User 1: Ahmed - Admin and Driver
    insertUser.run(
      'Ahmed Ali',
      'ahmed@aubh.edu.bh',
      hashedPassword,
      '+973-1234-5678',
      '12345678',
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
      '23456789',
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
      '34567890',
      'USER',
      'ACTIVE',
      now,
      now,
      now,
    );
    
    // User 4: Fawaz - Driver
    insertUser.run(
      'Fawaz Alkaabi',
      'fawaz@aubh.edu.bh',
      hashedPassword,
      '+973-4567-8901',
      '45678901',
      'USER',
      'ACTIVE',
      now,
      now,
      now,
    );

    // Seed drivers (simplified - using userId directly)
    const insertDriver = this.db.prepare(`
      INSERT INTO drivers (userId, licenseNumber, isVerified, verifiedAt, verifiedBy, rating, totalRides, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertDriver.run(1, 'DL12345', 1, now, 1, 4.5, 12, now, now); // Ahmed - verified by himself (admin)
    insertDriver.run(3, 'DL67890', 1, now, 1, 4.8, 8, now, now); // Mohammed - verified by Ahmed
    insertDriver.run(4, 'DL45678', 1, now, 1, 4.6, 5, now, now); // Fawaz - verified by Ahmed

    // Seed vehicles
    const insertVehicle = this.db.prepare(`
      INSERT INTO vehicles (userId, make, model, year, color, plateNumber, isActive, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertVehicle.run(1, 'Toyota', 'Camry', 2020, 'White', 'BH-12345', 1, now, now);
    insertVehicle.run(3, 'Honda', 'Accord', 2019, 'Black', 'BH-67890', 1, now, now);
    insertVehicle.run(4, 'Nissan', 'Altima', 2021, 'Silver', 'BH-45678', 1, now, now);

    // Seed riders (everyone can be a rider)
    const insertRider = this.db.prepare(`
      INSERT INTO riders (userId, preferredPickupLocation, rating, totalRides, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    insertRider.run(1, 'Manama City', 5.0, 3, now, now); // Ahmed
    insertRider.run(2, 'Seef District', 4.7, 5, now, now); // Fatima
    insertRider.run(3, 'Riffa', 5.0, 2, now, now); // Mohammed
    insertRider.run(4, 'Muharraq', 4.9, 4, now, now); // Fawaz

    // Helper function to generate 4-digit safety code
    const generateSafetyCode = () => {
      return Math.floor(1000 + Math.random() * 9000).toString();
    };

    // Helper function to calculate distance using Haversine formula (in km)
    const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
      const R = 6371; // Earth's radius in km
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLng = (lng2 - lng1) * Math.PI / 180;
      const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                Math.sin(dLng/2) * Math.sin(dLng/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      return R * c;
    };

    // Helper function to calculate fare
    const calculateFare = (distance: number) => {
      const baseFare = 0.5;
      const farePerKm = 0.15;
      const serviceFeePercentage = 10;
      const minFare = 1.0;

      const distanceFare = distance * farePerKm;
      const subtotal = baseFare + distanceFare;
      const serviceFee = subtotal * (serviceFeePercentage / 100);
      const totalFare = Math.max(subtotal + serviceFee, minFare);

      const driverEarnings = Number((totalFare * 0.85).toFixed(3));
      return {
        baseFare: Number(baseFare.toFixed(3)),
        distanceFare: Number(distanceFare.toFixed(3)),
        serviceFee: Number(serviceFee.toFixed(3)),
        totalFare: Number(totalFare.toFixed(3)),
        driverEarnings
      };
    };

    // Seed rides with realistic Bahrain locations and coordinates
    const insertRide = this.db.prepare(`
      INSERT INTO rides (
        userId, vehicleId, origin, destination,
        originLat, originLng, destinationLat, destinationLng,
        distance, estimatedDuration, departureTime, arrivalTime,
        rideStatus, baseFare, distanceFare, serviceFee, totalFare, driverEarnings,
        farePerSeat, availableSeats, totalSeats, safetyCode,
        createdAt, updatedAt
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    // Ride 1: Seef District to AUBH Campus (Ahmed)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(8, 0, 0, 0);
    
    const seefLat = 26.2361;
    const seefLng = 50.5339;
    const aubhLat = 26.0667;
    const aubhLng = 50.5577;
    const ride1Distance = calculateDistance(seefLat, seefLng, aubhLat, aubhLng);
    const ride1Fare = calculateFare(ride1Distance);
    
    insertRide.run(
      1, 1, 'Seef District', 'AUBH Campus',
      seefLat, seefLng, aubhLat, aubhLng,
      Number(ride1Distance.toFixed(2)), 25,
      tomorrow.toISOString(), null,
      'AVAILABLE',
      ride1Fare.baseFare, ride1Fare.distanceFare, ride1Fare.serviceFee, ride1Fare.totalFare, ride1Fare.driverEarnings,
      Number((ride1Fare.totalFare / 4).toFixed(3)),
      3, 4, generateSafetyCode(),
      now, now
    );

    // Ride 2: Manama City Center to Riffa (Mohammed)
    const dayAfterTomorrow = new Date();
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
    dayAfterTomorrow.setHours(14, 30, 0, 0);
    
    const manamaLat = 26.2285;
    const manamaLng = 50.5860;
    const riffaLat = 26.1300;
    const riffaLng = 50.5550;
    const ride2Distance = calculateDistance(manamaLat, manamaLng, riffaLat, riffaLng);
    const ride2Fare = calculateFare(ride2Distance);
    
    insertRide.run(
      3, 2, 'Manama City Center', 'Riffa',
      manamaLat, manamaLng, riffaLat, riffaLng,
      Number(ride2Distance.toFixed(2)), 20,
      dayAfterTomorrow.toISOString(), null,
      'AVAILABLE',
      ride2Fare.baseFare, ride2Fare.distanceFare, ride2Fare.serviceFee, ride2Fare.totalFare, ride2Fare.driverEarnings,
      Number((ride2Fare.totalFare / 4).toFixed(3)),
      4, 4, generateSafetyCode(),
      now, now
    );

    // Ride 3: Muharraq to Seef Mall (Fawaz)
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    nextWeek.setHours(10, 0, 0, 0);
    
    const muharraqLat = 26.2572;
    const muharraqLng = 50.6117;
    const seefMallLat = 26.2361;
    const seefMallLng = 50.5339;
    const ride3Distance = calculateDistance(muharraqLat, muharraqLng, seefMallLat, seefMallLng);
    const ride3Fare = calculateFare(ride3Distance);
    
    insertRide.run(
      4, 3, 'Muharraq', 'Seef Mall',
      muharraqLat, muharraqLng, seefMallLat, seefMallLng,
      Number(ride3Distance.toFixed(2)), 18,
      nextWeek.toISOString(), null,
      'AVAILABLE',
      ride3Fare.baseFare, ride3Fare.distanceFare, ride3Fare.serviceFee, ride3Fare.totalFare, ride3Fare.driverEarnings,
      Number((ride3Fare.totalFare / 5).toFixed(3)),
      5, 5, generateSafetyCode(),
      now, now
    );

    // Seed a booking with payment method
    const insertBooking = this.db.prepare(`
      INSERT INTO bookings (
        rideId, userId, seatsBooked, paymentMethod, benefitPayPhone,
        farePerSeat, totalAmount, serviceFee, driverEarnings,
        bookingStatus, createdAt, updatedAt
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const booking1FarePerSeat = ride1Fare.totalFare / 4;
    const booking1Total = booking1FarePerSeat * 1; // 1 seat booked
    const booking1ServiceFee = booking1Total * 0.1;
    const booking1DriverEarnings = booking1Total - booking1ServiceFee;

    insertBooking.run(
      1, 2, 1, 'BENEFITPAY', '23456789',
      Number(booking1FarePerSeat.toFixed(3)),
      Number(booking1Total.toFixed(3)),
      Number(booking1ServiceFee.toFixed(3)),
      Number(booking1DriverEarnings.toFixed(3)),
      'CONFIRMED',
      now, now
    );

    // Seed notifications
    const insertNotification = this.db.prepare(`
      INSERT INTO notifications (userId, type, title, message, relatedEntityType, relatedEntityId, isRead, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    // Notification for driver (Ahmed) about booking request
    insertNotification.run(
      1, 'BOOKING_REQUEST',
      'New Booking Request',
      'Fatima Hassan has booked 1 seat for your ride from Seef District to AUBH Campus',
      'booking', 1, 1, now
    );

    // Notification for rider (Fatima) about booking confirmation
    insertNotification.run(
      2, 'BOOKING_CONFIRMED',
      'Booking Confirmed',
      'Your booking for the ride from Seef District to AUBH Campus has been confirmed',
      'booking', 1, 0, now
    );

    // Welcome notification for all users
    for (let userId = 1; userId <= 4; userId++) {
      insertNotification.run(
        userId, 'SYSTEM',
        'Welcome to CarShare!',
        'Thank you for joining CarShare. Start offering or finding rides today!',
        null, null, userId === 1 ? 1 : 0, now
      );
    }
  }
}
