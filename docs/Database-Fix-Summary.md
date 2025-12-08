# Database Fix Summary

**Date:** December 8, 2025  
**Issue:** Backend failing to start with database initialization error

## Problem

Backend was crashing during startup with the following error:

```
SqliteError: NOT NULL constraint failed: rides.driverEarnings
  at database.service.ts:411:18
```

## Root Cause

The `rides` table schema (created in Phase 5) included a `driverEarnings` column with NOT NULL constraint, but:

1. The seed data `INSERT` statement was missing the `driverEarnings` column
2. The local `calculateFare` function in `database.service.ts` wasn't returning `driverEarnings`
3. All 3 ride insertion calls were missing the `driverEarnings` parameter

## Solution

### Fix 1: Updated INSERT Statement

**File:** `api/src/database/database.service.ts` (line 387)

**Before:**
```typescript
const insertRide = db.prepare(`
  INSERT INTO rides (
    userId, vehicleId, origin, destination,
    originLat, originLng, destinationLat, destinationLng,
    distance, estimatedDuration, departureTime, arrivalTime,
    rideStatus, baseFare, distanceFare, serviceFee, totalFare, // Missing driverEarnings
    farePerSeat, availableSeats, totalSeats, safetyCode,
    createdAt, updatedAt
  )
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) // 23 params
`);
```

**After:**
```typescript
const insertRide = this.db.prepare(`
  INSERT INTO rides (
    userId, vehicleId, origin, destination,
    originLat, originLng, destinationLat, destinationLng,
    distance, estimatedDuration, departureTime, arrivalTime,
    rideStatus, baseFare, distanceFare, serviceFee, totalFare, driverEarnings,
    farePerSeat, availableSeats, totalSeats, safetyCode,
    createdAt, updatedAt
  )
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) // 24 params
`);
```

**Changes:**
- Fixed `db` → `this.db` reference
- Added `driverEarnings` column after `totalFare`
- Increased VALUES parameters from 23 to 24

### Fix 2: Updated calculateFare Function

**File:** `api/src/database/database.service.ts` (line 377)

**Before:**
```typescript
const calculateFare = (distance: number) => {
  const baseFare = 0.5;
  const distanceFare = distance * 0.2;
  const serviceFee = (baseFare + distanceFare) * 0.15;
  const totalFare = baseFare + distanceFare + serviceFee;
  
  return {
    baseFare: Number(baseFare.toFixed(3)),
    distanceFare: Number(distanceFare.toFixed(3)),
    serviceFee: Number(serviceFee.toFixed(3)),
    totalFare: Number(totalFare.toFixed(3))
  };
};
```

**After:**
```typescript
const calculateFare = (distance: number) => {
  const baseFare = 0.5;
  const distanceFare = distance * 0.2;
  const serviceFee = (baseFare + distanceFare) * 0.15;
  const totalFare = baseFare + distanceFare + serviceFee;
  const driverEarnings = Number((totalFare * 0.85).toFixed(3));
  
  return {
    baseFare: Number(baseFare.toFixed(3)),
    distanceFare: Number(distanceFare.toFixed(3)),
    serviceFee: Number(serviceFee.toFixed(3)),
    totalFare: Number(totalFare.toFixed(3)),
    driverEarnings
  };
};
```

**Changes:**
- Added driver earnings calculation (85% of total fare)
- Added `driverEarnings` to return object

### Fix 3: Updated All Ride Insertions

**File:** `api/src/database/database.service.ts` (lines 415, 441, 465)

**Before (all 3 rides):**
```typescript
insertRide.run(
  1, 1, 'Seef District', 'AUBH Campus',
  seefLat, seefLng, aubhLat, aubhLng,
  Number(ride1Distance.toFixed(2)), 25,
  tomorrow.toISOString(), null,
  'AVAILABLE',
  ride1Fare.baseFare, ride1Fare.distanceFare, ride1Fare.serviceFee, ride1Fare.totalFare, // Missing driverEarnings
  Number((ride1Fare.totalFare / 4).toFixed(3)),
  3, 4, generateSafetyCode(),
  now, now
);
```

**After (all 3 rides):**
```typescript
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
```

**Changes:**
- Added `ride1Fare.driverEarnings` parameter after `totalFare` (same for ride2 and ride3)

## Verification

Backend now starts successfully with all 3 seed rides properly initialized:

```
[Nest] 30336  - 08/12/2025, 9:23:45 PM     LOG [NestApplication] Nest application successfully started +193ms
```

## Database Schema Alignment

The seed data now properly aligns with the `rides` table schema:

| Column | Type | Constraint | Seed Data Source |
|--------|------|------------|-----------------|
| baseFare | REAL | NOT NULL | `calculateFare().baseFare` |
| distanceFare | REAL | NOT NULL | `calculateFare().distanceFare` |
| serviceFee | REAL | NOT NULL | `calculateFare().serviceFee` |
| totalFare | REAL | NOT NULL | `calculateFare().totalFare` |
| **driverEarnings** | REAL | NOT NULL | `calculateFare().driverEarnings` ✅ |

## Related Files

- ✅ `api/src/database/database.service.ts` - Seed data fixed
- ✅ `api/src/services/ride.service.ts` - Already using driverEarnings from Phase 5
- ✅ `api/src/entities/ride.entity.ts` - Schema includes driverEarnings column

## Impact

- ✅ Backend starts successfully
- ✅ All 3 seed rides include driver earnings (85% of total fare)
- ✅ Database constraints satisfied
- ✅ No breaking changes to existing API endpoints
