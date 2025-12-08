# Phase 1: Enhanced Database Schema

**Date:** December 8, 2025  
**Status:** In Progress

## Overview
Major database schema refactor to support advanced features including location-based services, notifications, safety codes, distance-based pricing, and payment methods.

## New Schema Design

### 1. Enhanced Rides Table
**New Fields:**
- `originLat` REAL - Pickup latitude coordinate
- `originLng` REAL - Pickup longitude coordinate  
- `destinationLat` REAL - Dropoff latitude coordinate
- `destinationLng` REAL - Dropoff longitude coordinate
- `distance` REAL - Total ride distance in kilometers
- `estimatedDuration` INTEGER - Estimated duration in minutes
- `baseFare` REAL - Base fare amount
- `distanceFare` REAL - Distance-based fare
- `serviceFee` REAL - Platform service fee
- `totalFare` REAL - Total calculated fare
- `safetyCode` TEXT - 4-digit code for driver verification

### 2. Enhanced Bookings Table
**New Fields:**
- `paymentMethod` TEXT - 'CASH' or 'BENEFITPAY'
- `benefitPayPhone` TEXT - Driver's BenefitPay phone number
- `farePerSeat` REAL - Price per seat
- `totalAmount` REAL - Total amount for booking
- `serviceFee` REAL - Service fee portion
- `driverEarnings` REAL - Driver's earnings after fees

### 3. New Notifications Table
```sql
CREATE TABLE notifications (
  notificationId INTEGER PRIMARY KEY AUTOINCREMENT,
  userId INTEGER NOT NULL,
  type TEXT NOT NULL, -- 'BOOKING_REQUEST', 'BOOKING_CONFIRMED', 'RIDE_STARTED', etc.
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  relatedRideId INTEGER,
  relatedBookingId INTEGER,
  isRead INTEGER DEFAULT 0,
  createdAt TEXT NOT NULL,
  FOREIGN KEY (userId) REFERENCES users(userId) ON DELETE CASCADE
)
```

### 4. Enhanced Users Table
**New Fields:**
- `benefitPayPhone` TEXT - User's BenefitPay phone number for payments

### 5. System Settings Table
```sql
CREATE TABLE system_settings (
  settingKey TEXT PRIMARY KEY,
  settingValue TEXT NOT NULL,
  updatedAt TEXT NOT NULL
)
```

**Initial Settings:**
- `base_fare` - Base fare per ride (e.g., "1.5")
- `fare_per_km` - Cost per kilometer (e.g., "0.5")
- `service_fee_percentage` - Platform fee percentage (e.g., "15")
- `min_fare` - Minimum fare amount (e.g., "2.0")

## Implementation Plan

### Step 1: Backup Current Database
- Export current data
- Save schema definition

### Step 2: Drop and Recreate Tables
- Clean slate approach for major refactor
- Seed with test data including new fields

### Step 3: Update Entities
- Add new fields to TypeScript entities
- Update interfaces and types

### Step 4: Update DTOs
- Add validation for new fields
- Make location coordinates required for rides

### Step 5: Update Repositories
- Add queries for location-based searches
- Add notification CRUD operations

### Step 6: Update Services
- Implement distance calculation using Haversine formula
- Implement fare calculation logic
- Add notification service

## Breaking Changes
⚠️ **Warning:** This is a complete database reset. All existing data will be lost.

**Migration Strategy:**
1. Development: Fresh database with seed data
2. Production (future): Create proper migration scripts

## Next Steps
- Phase 2: Implement OpenStreetMap integration
- Phase 3: Real-time notification system
- Phase 4: Distance and fare calculations

---
**Status:** Schema design complete, ready for implementation
