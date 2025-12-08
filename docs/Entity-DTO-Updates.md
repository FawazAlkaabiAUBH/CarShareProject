# Entity and DTO Updates - Phase 1 Complete

**Date:** December 8, 2025  
**Status:** ✅ ALL UPDATES COMPLETE

---

## 📦 Updated Entities

### ✅ User Entity
**File:** `api/src/entities/user.entity.ts`

**New Field:**
- `benefitPayPhone?: string` - BenefitPay phone number (8 digits)

---

### ✅ Ride Entity
**File:** `api/src/entities/ride.entity.ts`

**New Fields (13 total):**
- `originLat: number` - Origin latitude
- `originLng: number` - Origin longitude
- `destinationLat: number` - Destination latitude
- `destinationLng: number` - Destination longitude
- `distance?: number` - Calculated distance in km
- `estimatedDuration?: number` - Estimated duration in minutes
- `baseFare: number` - Base fare component
- `distanceFare: number` - Distance-based fare component
- `serviceFee: number` - Platform service fee
- `totalFare: number` - Complete fare (base + distance + fee)
- `safetyCode?: string` - 4-digit verification code

**Removed Fields:**
- None (farePerSeat retained for backward compatibility)

---

### ✅ Booking Entity
**File:** `api/src/entities/booking.entity.ts`

**New Fields (6 total):**
- `paymentMethod: 'CASH' | 'BENEFITPAY'` - Payment method
- `benefitPayPhone?: string` - BenefitPay phone (if applicable)
- `farePerSeat: number` - Fare per seat booked
- `totalAmount: number` - Total payment amount
- `serviceFee: number` - Service fee charged
- `driverEarnings: number` - Net earnings for driver

**Removed Fields:**
- `totalFare` → Renamed to `totalAmount` for clarity

---

### ✅ Notification Entity (NEW)
**File:** `api/src/entities/notification.entity.ts`

**Fields:**
- `notificationId: number` - Primary key
- `userId: number` - Recipient user ID
- `type: NotificationType` - Notification type enum
- `title: string` - Notification title
- `message: string` - Notification message
- `relatedEntityType?: string` - Related entity type (e.g., 'booking')
- `relatedEntityId?: number` - Related entity ID
- `isRead: boolean` - Read status
- `createdAt: Date` - Creation timestamp

**Notification Types:**
- `BOOKING_REQUEST` - Driver receives booking
- `BOOKING_CONFIRMED` - Rider's booking confirmed
- `BOOKING_CANCELLED` - Booking cancelled
- `RIDE_STARTED` - Ride has started
- `RIDE_COMPLETED` - Ride completed
- `DRIVER_VERIFIED` - Driver verified by admin
- `SYSTEM` - System announcements

---

### ✅ SystemSetting Entity (NEW)
**File:** `api/src/entities/system-setting.entity.ts`

**Fields:**
- `settingKey: string` - Primary key (e.g., 'BASE_FARE')
- `settingValue: string` - Setting value
- `description?: string` - Human-readable description
- `updatedAt: Date` - Last update timestamp

**Predefined Settings:**
- `BASE_FARE`: 0.500 BHD
- `FARE_PER_KM`: 0.150 BHD
- `SERVICE_FEE_PERCENTAGE`: 10%
- `MIN_FARE`: 1.000 BHD
- `CURRENCY_CODE`: BHD

---

## 📝 Updated DTOs

### ✅ CreateUserDto & UpdateUserDto
**File:** `api/src/dto/user.dto.ts`

**New Validation:**
```typescript
@IsOptional()
@IsString()
@Matches(/^\d{8}$/, { message: 'BenefitPay phone must be 8 digits' })
benefitPayPhone?: string;
```

---

### ✅ CreateRideDto
**File:** `api/src/dto/ride.dto.ts`

**New Required Fields:**
```typescript
@IsNotEmpty()
@IsNumber()
@Min(-90)
@Max(90)
originLat: number;

@IsNotEmpty()
@IsNumber()
@Min(-180)
@Max(180)
originLng: number;

@IsNotEmpty()
@IsNumber()
@Min(-90)
@Max(90)
destinationLat: number;

@IsNotEmpty()
@IsNumber()
@Min(-180)
@Max(180)
destinationLng: number;
```

**New Optional Fields:**
```typescript
@IsOptional()
@IsNumber()
@Min(0)
estimatedDuration?: number; // in minutes
```

**Removed Fields:**
- `farePerSeat` - Now calculated automatically based on distance

---

### ✅ UpdateRideDto
**File:** `api/src/dto/ride.dto.ts`

**New Optional Fields:**
- All coordinate fields (originLat, originLng, destinationLat, destinationLng)
- `estimatedDuration`

---

### ✅ CreateBookingDto
**File:** `api/src/dto/booking.dto.ts`

**New Required Fields:**
```typescript
@IsNotEmpty()
@IsEnum(['CASH', 'BENEFITPAY'])
paymentMethod: 'CASH' | 'BENEFITPAY';
```

**New Optional Fields:**
```typescript
@IsOptional()
@IsString()
@Matches(/^\d{8}$/, { message: 'BenefitPay phone must be 8 digits' })
benefitPayPhone?: string; // Required if paymentMethod is BENEFITPAY
```

---

### ✅ Notification DTOs (NEW)
**File:** `api/src/dto/notification.dto.ts`

**CreateNotificationDto:**
```typescript
userId: number;
type: NotificationType;
title: string;
message: string;
relatedEntityType?: string;
relatedEntityId?: number;
```

**MarkNotificationReadDto:**
```typescript
isRead: boolean;
```

---

## 🔧 Updated Services

### ✅ RideService
**File:** `api/src/services/ride.service.ts`

**New Methods:**
```typescript
private calculateDistance(lat1, lng1, lat2, lng2): number
// Haversine formula implementation

private calculateFare(distance): FareBreakdown
// Automatic fare calculation

private generateSafetyCode(): string
// 4-digit code generation
```

**Updated Methods:**
- `createRideListing()` - Now accepts coordinates, calculates distance/fare, generates safety code

---

### ✅ BookingService
**File:** `api/src/services/booking.service.ts`

**Updated Methods:**
- `createBooking()` - Now validates payment method, calculates fare breakdown including driver earnings

---

## 🗄️ Updated Repositories

### ✅ RideRepository
**File:** `api/src/repositories/ride.repository.ts`

**Updated Methods:**
- `save()` - INSERT/UPDATE now handles 13 additional fields
- `mapToEntity()` - Maps all new database fields to entity

---

### ✅ BookingRepository
**File:** `api/src/repositories/booking.repository.ts`

**Updated Methods:**
- `save()` - INSERT/UPDATE now handles payment and fare fields
- `mapToEntity()` - Maps payment method and fare breakdown fields

---

## ✅ Compilation Status

**Build Result:** SUCCESS ✅
```bash
> pnpm run build
✓ TypeScript compilation successful
✓ No errors found
✓ All types validated
```

**Watch Mode:** RUNNING ✅
- Backend server running on port 3000
- Hot reload enabled
- No compilation errors

---

## 🎯 Breaking Changes

### Frontend Impact

#### 1. Ride Creation (BREAKING)
**Old Payload:**
```json
{
  "vehicleId": 1,
  "origin": "Seef",
  "destination": "AUBH",
  "departureTime": "2025-12-09T08:00:00Z",
  "totalSeats": 4,
  "farePerSeat": 2.5
}
```

**New Payload:**
```json
{
  "vehicleId": 1,
  "origin": "Seef District",
  "destination": "AUBH Campus",
  "originLat": 26.2361,
  "originLng": 50.5339,
  "destinationLat": 26.0667,
  "destinationLng": 50.5577,
  "departureTime": "2025-12-09T08:00:00Z",
  "totalSeats": 4,
  "estimatedDuration": 25
}
```

**Changes:**
- ✅ Added `originLat`, `originLng`, `destinationLat`, `destinationLng` (REQUIRED)
- ✅ Added `estimatedDuration` (optional)
- ❌ Removed `farePerSeat` (auto-calculated now)

---

#### 2. Booking Creation (BREAKING)
**Old Payload:**
```json
{
  "rideId": 1,
  "seatsBooked": 2
}
```

**New Payload:**
```json
{
  "rideId": 1,
  "seatsBooked": 2,
  "paymentMethod": "BENEFITPAY",
  "benefitPayPhone": "12345678"
}
```

**Changes:**
- ✅ Added `paymentMethod` (REQUIRED: 'CASH' or 'BENEFITPAY')
- ✅ Added `benefitPayPhone` (required if paymentMethod is BENEFITPAY)

---

#### 3. Response Schema Changes

**Ride Response - New Fields:**
```json
{
  "rideId": 1,
  "originLat": 26.2361,
  "originLng": 50.5339,
  "destinationLat": 26.0667,
  "destinationLng": 50.5577,
  "distance": 18.99,
  "estimatedDuration": 25,
  "baseFare": 0.5,
  "distanceFare": 2.848,
  "serviceFee": 0.335,
  "totalFare": 3.683,
  "safetyCode": "1062"
}
```

**Booking Response - New Fields:**
```json
{
  "bookingId": 1,
  "paymentMethod": "BENEFITPAY",
  "benefitPayPhone": "12345678",
  "farePerSeat": 0.921,
  "totalAmount": 1.842,
  "serviceFee": 0.184,
  "driverEarnings": 1.658
}
```

---

## 📋 Frontend Update Checklist

### High Priority (Blocking)
- [ ] Update ride creation form to include map with coordinate selection
- [ ] Add payment method selector to booking form
- [ ] Update ride display to show fare breakdown
- [ ] Display driver earnings in driver dashboard

### Medium Priority
- [ ] Add distance and duration display to ride cards
- [ ] Show safety code to drivers in ride details
- [ ] Display payment method in booking details
- [ ] Add BenefitPay phone to driver profile

### Low Priority
- [ ] Add fare calculator preview before ride creation
- [ ] Show estimated travel time on ride cards
- [ ] Display map preview of pickup/dropoff locations

---

## 🚀 Next Steps

**Phase 2: OpenStreetMap Integration**
1. Install frontend dependencies: `react-leaflet`, `leaflet`
2. Create `LocationPicker` component with map
3. Update ride creation page with map selection
4. Add "Find Rides Near Me" feature
5. Display rides on map with markers

**Estimated Time:** 3-4 hours

---

## ✅ Phase 1 Sign-Off

- **Database schema:** ✅ COMPLETE
- **Entity classes:** ✅ COMPLETE  
- **DTOs with validation:** ✅ COMPLETE
- **Service layer updates:** ✅ COMPLETE
- **Repository updates:** ✅ COMPLETE
- **TypeScript compilation:** ✅ SUCCESS
- **Backend running:** ✅ STABLE

**Phase 1 Status:** 🎉 FULLY COMPLETE AND READY FOR PHASE 2

