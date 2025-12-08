# Recent Changes Summary

**Date:** December 8, 2025  
**Session Focus:** Bug Fixes, Schema Migration, and Driver Registration Restructuring

---

## 1. Backend Schema Migration

### Database Schema Updates
- **Field Name Changes:**
  - `name` → `fullName` (users table)
  - `pickupLocation` → `origin` (rides table)
  - `dropoffLocation` → `destination` (rides table)
  - `pickupTime` → `departureTime` (rides table)
  - `dropoffTime` → `arrivalTime` (rides table)

### Entities & DTOs Updated
- Updated all entities to use new field names
- Updated all DTOs to use new field names
- Updated all repository queries to match new schema
- Updated all service methods to handle new field names

### Files Modified
- `api/src/entities/user.entity.ts`
- `api/src/entities/ride.entity.ts`
- `api/src/dto/user.dto.ts`
- `api/src/dto/ride.dto.ts`
- `api/src/repositories/user.repository.ts`
- `api/src/repositories/ride.repository.ts`
- `api/src/services/user.service.ts`
- `api/src/auth/auth.service.ts`
- `api/src/database/database.service.ts`

---

## 2. DTO Validation - Added Class-Validator Decorators

### Problem
ValidationPipe was rejecting all API requests with "property should not exist" errors because DTOs lacked validation decorators.

### Solution
Added proper class-validator decorators to all DTOs:

#### Vehicle DTOs (`api/src/dto/vehicle.dto.ts`)
- `@IsNotEmpty()`, `@IsNumber()`, `@IsString()` for required fields
- `@IsOptional()` for optional fields
- `@Min(1900)`, `@Max(2100)` for year validation

#### Driver DTOs (`api/src/dto/driver.dto.ts`)
- Added decorators for `userId`, `licenseNumber`, `licenseDocument`

#### Rider DTOs (`api/src/dto/rider.dto.ts`)
- Added decorators for all registration and update fields

#### Ride DTOs (`api/src/dto/ride.dto.ts`)
- Added decorators with `@Min()` constraints
- `@IsEnum()` for rideStatus validation

#### Rating DTOs (`api/src/dto/rating.dto.ts`)
- Added `@Min(1)`, `@Max(5)` for score validation
- `@IsArray()` with `@IsString({ each: true })` for feedbackTags

#### Booking DTOs (`api/src/dto/booking.dto.ts`)
- Already had decorators from previous fix

---

## 3. Driver Verification Logic Fix

### Problem
`offer-ride` page incorrectly detected users as non-drivers even when they had verified driver profiles.

### Root Cause
Driver repository was checking `!!row.verifiedAt` but database had:
- `isVerified` column (INTEGER) set to `1`
- `verifiedAt` column (TEXT) set to `null`

### Solution
Changed driver repository `mapToEntity()` to use the actual database column:
```typescript
// Before
isVerified: !!row.verifiedAt,

// After
isVerified: !!row.isVerified,
```

**File Modified:** `api/src/repositories/driver.repository.ts`

---

## 4. Frontend Schema Alignment

### Pages Updated
All frontend pages updated to use new schema field names:

1. **Dashboard** (`web/app/(dashboard)/dashboard/page.tsx`)
   - Added `fullName` fallback: `{user.fullName || 'User'}`

2. **Profile** (`web/app/(dashboard)/profile/page.tsx`)
   - Added safe navigation: `{user.fullName?.charAt(0) || user.email.charAt(0).toUpperCase()}`
   - Fixed profile update to send `fullName` instead of `name`
   - Added driver status check to hide "My Vehicles" button for non-drivers

3. **Ride Details** (`web/app/(dashboard)/ride/[id]/page.tsx`)
   - Unified driver profile card with vehicle information
   - Updated to use `origin`, `destination`, `departureTime`

4. **Booking Details** (`web/app/(dashboard)/booking/[id]/page.tsx`)
   - Unified driver profile card (matching ride/[id])

5. **Offer Ride** (`web/app/(dashboard)/offer-ride/page.tsx`)
   - Updated form to use `origin`, `destination`, `departureTime`
   - Fixed driver status detection

6. **Find Ride** (`web/app/(dashboard)/find-ride/page.tsx`)
   - Updated to display new field names

7. **Signup Pages**
   - `web/app/(auth)/signup/page.tsx` - uses `fullName`
   - `web/app/(auth)/signup/driver/page.tsx` - restructured (see below)

---

## 5. Driver Registration Restructure

### Old Flow (Removed)
- Public signup page with 3 steps (personal info → password → vehicle/license)
- Created user account + driver profile + vehicle in one flow
- Non-logged-in users could become drivers directly

### New Flow (Implemented)

#### Step 1: Redirect Page (`web/app/(auth)/signup/driver/page.tsx`)
- **Purpose:** Information page for non-logged-in users
- **Features:**
  - Explains account requirement
  - Lists what documents are needed
  - Redirects logged-in users to `/become-driver`
  - Buttons: "Create Account" or "I Already Have an Account"

#### Step 2: Become Driver Page (`web/app/(dashboard)/become-driver/page.tsx`)
- **Purpose:** Logged-in users can apply to become drivers
- **Authentication:** Requires active user session, redirects to login if not authenticated
- **Features:**
  - 2-step process: License info → Vehicle info
  - File upload for license and vehicle documents (JPEG/PNG/PDF, max 5MB)
  - Base64 encoding of uploaded files
  - Progress indicators
  - Checks if user is already a driver
  - Personalized greeting with user's name
  - Validation at each step

**Flow:** Sign up as user → Log in → Go to "Become a Driver" → Submit documents → Wait for admin verification

---

## 6. Profile Page Enhancements

### Driver-Only Features
Added driver status check to conditionally show "My Vehicles" button:
```typescript
const [isDriver, setIsDriver] = useState(false);

// Check driver status via API
const checkDriverStatus = async (userId: number) => {
  const response = await apiClient.get(`/drivers/user/${userId}/status`);
  setIsDriver(response.data.isDriver && response.data.isVerified);
};

// Conditional rendering
{isDriver && (
  <Card onClick={() => setActiveSection('vehicles')}>
    My Vehicles
  </Card>
)}
```

### Crash Prevention
Added defensive coding to prevent crashes when `fullName` is undefined:
- Optional chaining: `user.fullName?.charAt(0)`
- Fallback values: `user.fullName || 'User'`
- Backward compatibility: handles both `fullName` and legacy `name` field

---

## 7. File Upload Implementation

### Current Implementation
Files are converted to base64 and stored in database:
- License documents → `drivers.licenseDocument` (TEXT column)
- Vehicle documents → `vehicles.vehicleDocument` (TEXT column)

### Limitations
- Database bloat (base64 is ~33% larger than binary)
- Poor query performance
- Not scalable for production

### Recommended Future Improvement
Implement proper file storage:
1. Save files to `api/uploads/` directory
2. Store only file paths in database
3. Or use cloud storage (AWS S3, Azure Blob)

---

## 8. Key Technical Decisions

### Authentication Flow
- All driver-related features require authenticated session
- Non-logged-in users are redirected to login
- Driver status checked via `/drivers/user/:userId/status` endpoint

### Validation Strategy
- Backend: class-validator decorators on all DTOs
- Frontend: Form validation before submission
- File validation: Type checking (JPEG/PNG/PDF) and size limits (5MB)

### User Experience
- Progressive disclosure: 2-step process instead of overwhelming 3-step form
- Clear feedback: Progress indicators, success/error messages, informative cards
- Defensive coding: Fallbacks and optional chaining prevent crashes

---

## 9. Database State

### Current Schema
```sql
-- Users
CREATE TABLE users (
  userId INTEGER PRIMARY KEY,
  fullName TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phoneNumber TEXT NOT NULL,
  password TEXT NOT NULL,
  role TEXT DEFAULT 'USER',
  accountStatus TEXT DEFAULT 'ACTIVE',
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL,
  lastLogin TEXT
);

-- Drivers
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
  updatedAt TEXT NOT NULL
);

-- Vehicles
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
  updatedAt TEXT NOT NULL
);

-- Rides
CREATE TABLE rides (
  rideId INTEGER PRIMARY KEY AUTOINCREMENT,
  userId INTEGER NOT NULL,
  vehicleId INTEGER NOT NULL,
  origin TEXT NOT NULL,
  destination TEXT NOT NULL,
  departureTime TEXT NOT NULL,
  arrivalTime TEXT,
  rideStatus TEXT NOT NULL,
  farePerSeat REAL NOT NULL,
  availableSeats INTEGER NOT NULL,
  totalSeats INTEGER NOT NULL,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL
);
```

---

## 10. Breaking Changes

### For Existing Users
- **Must re-login** to get updated JWT token with `fullName` field
- Old localStorage data with `name` field will show fallback values
- Clearing localStorage and re-logging in recommended

### For API Consumers
- All user endpoints now use `fullName` instead of `name`
- All ride endpoints now use `origin`, `destination`, `departureTime`
- All DTOs require proper validation decorators

---

## Files Created/Modified Summary

### Backend Files
- ✅ All DTO files (added validation decorators)
- ✅ `driver.repository.ts` (fixed isVerified logic)
- ✅ `user.repository.ts` (fullName queries)
- ✅ `database.service.ts` (schema updates)
- ✅ All entities (field name changes)

### Frontend Files
- ✅ `become-driver/page.tsx` (new implementation)
- ✅ `signup/driver/page.tsx` (simplified redirect page)
- ✅ `profile/page.tsx` (driver status check, safe navigation)
- ✅ `dashboard/page.tsx` (fullName fallback)
- ✅ `ride/[id]/page.tsx` (unified driver card)
- ✅ `booking/[id]/page.tsx` (unified driver card)
- ✅ `offer-ride/page.tsx` (schema updates)
- ✅ `find-ride/page.tsx` (schema updates)

### Documentation
- ✅ This summary document

---

## Next Steps / Recommendations

1. **File Storage:** Implement proper file storage instead of base64 in database
2. **Admin Panel:** Create admin interface to verify drivers and view documents
3. **Email Notifications:** Send emails when driver application is approved/rejected
4. **Testing:** Add unit tests for new validation logic
5. **Migration Script:** Create script to migrate old `name` data to `fullName`
6. **API Documentation:** Update API docs with new field names
7. **Error Handling:** Add more specific error messages for validation failures

---

## Known Issues

1. **Old localStorage data** - Users with cached data need to re-login
2. **File storage in DB** - Not scalable, needs refactoring
3. **No admin verification UI** - Drivers can be created but not verified through UI

---

**End of Summary**
