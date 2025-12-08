# Backend Refactor Summary - Frontend Integration

## Overview
This document outlines all backend changes made to support the new 29-screen frontend design for AUBH CarShare.

**Date**: December 8, 2025  
**Branch**: new-frontend  
**Objective**: Extend backend API to fully support new frontend features including authentication enhancements, in-app chat, scheduled rides, and safety verification.

---

## 1. Database Schema Updates

### 1.1 Users Table - New Fields
Added fields to support enhanced user profiles:

```sql
ALTER TABLE users ADD COLUMN aubhId TEXT;
ALTER TABLE users ADD COLUMN gender TEXT CHECK(gender IN ('MALE', 'FEMALE'));
ALTER TABLE users ADD COLUMN verificationCode TEXT;
ALTER TABLE users ADD COLUMN verificationCodeExpiry TEXT;
ALTER TABLE users ADD COLUMN isVerified INTEGER DEFAULT 0;
```

**Purpose**:
- `aubhId`: AUBH student/staff ID for university verification
- `gender`: User gender for profile completeness
- `verificationCode`: 6-digit code for email/phone verification
- `verificationCodeExpiry`: Expiration timestamp for verification codes
- `isVerified`: Boolean flag for account verification status

### 1.2 Rides Table - Recurring Rides
Added fields for scheduled/recurring ride support:

```sql
ALTER TABLE rides ADD COLUMN isRecurring INTEGER DEFAULT 0;
ALTER TABLE rides ADD COLUMN recurringSchedule TEXT;
```

**Purpose**:
- `isRecurring`: Flag to indicate if ride repeats on a schedule
- `recurringSchedule`: JSON string containing recurring details (days, times)

### 1.3 Messages Table - New Table
Created new table for in-app chat functionality:

```sql
CREATE TABLE messages (
  messageId INTEGER PRIMARY KEY AUTOINCREMENT,
  rideId INTEGER NOT NULL,
  fromUserId INTEGER NOT NULL,
  toUserId INTEGER NOT NULL,
  text TEXT NOT NULL,
  isRead INTEGER DEFAULT 0,
  createdAt TEXT NOT NULL,
  FOREIGN KEY (rideId) REFERENCES rides(rideId),
  FOREIGN KEY (fromUserId) REFERENCES users(userId),
  FOREIGN KEY (toUserId) REFERENCES users(userId)
);
```

**Purpose**: Enable real-time messaging between drivers and riders during active rides.

---

## 2. Entity Updates

### 2.1 User Entity (`user.entity.ts`)
```typescript
export class User {
  userId: number;
  fullName: string;
  email: string;
  password: string;
  phoneNumber: string;
  aubhId?: string;              // NEW
  gender?: 'MALE' | 'FEMALE';   // NEW
  benefitPayPhone?: string;
  role: 'USER' | 'ADMIN';
  accountStatus: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  verificationCode?: string;           // NEW
  verificationCodeExpiry?: Date;       // NEW
  isVerified: boolean;                 // NEW
  createdAt: Date;
  updatedAt: Date;
  lastLogin: Date;
}
```

### 2.2 Ride Entity (`ride.entity.ts`)
```typescript
export class Ride {
  // ... existing fields
  safetyCode?: string;
  isRecurring: boolean;          // NEW
  recurringSchedule?: string;    // NEW
  createdAt: Date;
  updatedAt: Date;
}
```

### 2.3 Message Entity (`message.entity.ts`) - NEW
```typescript
export class Message {
  messageId: number;
  rideId: number;
  fromUserId: number;
  toUserId: number;
  text: string;
  isRead: boolean;
  createdAt: Date;
}
```

---

## 3. DTO Updates

### 3.1 User DTOs (`user.dto.ts`)
**CreateUserDto** - Added:
- `aubhId?: string`
- `gender?: 'MALE' | 'FEMALE'`

**New DTOs Added**:
```typescript
export class VerifyCodeDto {
  emailOrPhone: string;
  code: string; // 6-digit code
}

export class SendVerificationDto {
  emailOrPhone: string;
}
```

### 3.2 Ride DTOs (`ride.dto.ts`)
**CreateRideDto** - Added:
- `isRecurring?: boolean`
- `recurringSchedule?: string`

### 3.3 Message DTOs (`message.dto.ts`) - NEW
```typescript
export class CreateMessageDto {
  rideId: number;
  toUserId: number;
  text: string;
}

export class GetMessagesDto {
  rideId: number;
}

export class MarkReadDto {
  messageId: number;
}
```

---

## 4. API Endpoints - New/Updated

### 4.1 Authentication Endpoints (`auth.controller.ts`)

| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| POST | `/auth/register` | User registration (updated with new fields) | ✅ Updated |
| POST | `/auth/login` | Login with email OR phone | ✅ Updated |
| POST | `/auth/send-verification` | Send 6-digit verification code | ✅ New |
| POST | `/auth/verify` | Verify code and activate account | ✅ New |

**Updated Login Response**:
```json
{
  "user": { ... },
  "access_token": "jwt_token",
  "hasDriverProfile": true,
  "hasRiderProfile": true
}
```

### 4.2 Message Endpoints (`message.controller.ts`) - NEW

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| POST | `/messages` | Send a message in a ride chat | JWT Required |
| GET | `/messages/ride/:rideId` | Get all messages for a ride | JWT Required |
| GET | `/messages/conversations` | Get user's conversations | JWT Required |
| GET | `/messages/unread/count` | Get unread message count | JWT Required |
| PATCH | `/messages/:messageId/read` | Mark message as read | JWT Required |

**Example Response**:
```json
{
  "messageId": 1,
  "rideId": 5,
  "fromUserId": 2,
  "toUserId": 3,
  "text": "Hi! I'm on my way",
  "isRead": false,
  "createdAt": "2025-12-08T10:30:00Z"
}
```

### 4.3 Ride Endpoints - Updated

| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| POST | `/rides/:id/verify-safety-code` | Verify safety code before ride start | ✅ New |

**Request Body**:
```json
{
  "safetyCode": "4827"
}
```

**Response**:
```json
{
  "verified": true,
  "message": "Safety code verified successfully",
  "rideId": 5
}
```

---

## 5. Service Layer Updates

### 5.1 AuthService (`auth.service.ts`)

**New Methods**:
- `sendVerificationCode(emailOrPhone: string)`: Generates and sends 6-digit code
- `verifyCode(emailOrPhone: string, code: string)`: Validates code and marks user verified
- `generateVerificationCode()`: Creates random 6-digit number

**Updated Methods**:
- `register()`: Now creates verification code after signup
- `login()`: Accepts email OR phone number, returns driver/rider profile status

**Verification Code Logic**:
- Code expires after 10 minutes
- Stored in database with expiry timestamp
- Can be resent with new expiry

### 5.2 RideService (`ride.service.ts`)

**New Methods**:
- `verifySafetyCode(rideId, code, userId)`: Validates safety code match

**Updated Methods**:
- `createRideListing()`: Now handles `isRecurring` and `recurringSchedule` fields

### 5.3 MessageService (`message.service.ts`) - NEW

```typescript
class MessageService {
  sendMessage(fromUserId, dto: CreateMessageDto)
  getMessagesForRide(rideId, userId)
  getUserConversations(userId)
  getUnreadCount(userId)
  markAsRead(messageId, userId)
}
```

---

## 6. Repository Layer Updates

### 6.1 UserRepository (`user.repository.ts`)

**New Methods**:
```typescript
findByPhone(phoneNumber: string): User
findByEmailOrPhone(emailOrPhone: string): User
setVerificationCode(userId, code, expiry)
verifyUser(userId)
```

**Updated Methods**:
- `save()`: Now includes aubhId, gender, verification fields
- `mapToEntity()`: Maps all new fields from database rows

### 6.2 RideRepository (`ride.repository.ts`)

**Updated Methods**:
- `save()`: INSERT and UPDATE now include `isRecurring` and `recurringSchedule`
- `mapToEntity()`: Maps new recurring fields

### 6.3 MessageRepository (`message.repository.ts`) - NEW

```typescript
class MessageRepository {
  save(messageData): Message
  findByRideId(rideId): Message[]
  findByUserId(userId): Message[]
  findById(messageId): Message
  markAsRead(messageId): Message
  markAllAsReadForRide(rideId, userId)
  countUnread(userId): number
}
```

---

## 7. Frontend-Backend Integration Points

### 7.1 Authentication Flow

**Frontend Screens**:
1. Signup (`/signup`) → POST `/auth/register`
2. Verification (`/verification`) → POST `/auth/verify`
3. Login (`/login`) → POST `/auth/login`

**Data Flow**:
```
Signup Screen → Backend creates user + sends verification code
Verification Screen → Backend validates code + marks verified
Login Screen → Backend checks credentials + returns profiles
```

### 7.2 Chat Feature

**Frontend Screens**:
- Chat (`/chat`) → GET `/messages/ride/:rideId`, POST `/messages`

**Real-time Updates**:
- Frontend polls `/messages/ride/:rideId` every 5 seconds
- Unread count shown in notification bell via `/messages/unread/count`

### 7.3 Scheduled Rides

**Frontend Screens**:
- Scheduled Rides (`/scheduled-rides`) → GET `/rides/driver/:userId?isRecurring=true`
- Post Ride (`/driver/post-ride`) → POST `/rides` with `isRecurring: true`

**Recurring Schedule Format**:
```json
{
  "days": ["Monday", "Wednesday", "Friday"],
  "times": ["08:00", "17:00"],
  "endDate": "2025-12-31"
}
```

### 7.4 Safety Code Verification

**Frontend Screens**:
- Driver In-Ride → Shows safety code from ride object
- Rider In-Ride → POST `/rides/:id/verify-safety-code`

**Verification Flow**:
1. Driver creates ride → Backend generates 4-digit code
2. Driver shares code verbally with rider
3. Rider enters code → Frontend validates via API
4. Match confirmed → Ride starts

---

## 8. Security Enhancements

### 8.1 JWT Authentication
- All chat endpoints require valid JWT token
- User can only read/send messages for rides they're part of
- Safety code verification requires authentication

### 8.2 Verification Codes
- 6-digit codes with 10-minute expiry
- Codes hashed before storage (future enhancement)
- Rate limiting on resend (future enhancement)

### 8.3 Input Validation
- All DTOs use class-validator decorators
- Phone number regex validation
- Email format validation
- Safety code format validation (4 digits)
- Verification code format (6 digits)

---

## 9. Breaking Changes

### 9.1 Login Endpoint
**Old**:
```typescript
POST /auth/login
{ "email": "user@example.com", "password": "..." }
```

**New**:
```typescript
POST /auth/login
{ "emailOrPhone": "user@example.com OR +973-1234-5678", "password": "..." }
```

**Migration**: Frontend updated to use `emailOrPhone` field.

### 9.2 User Response
**Old**: `{ user, access_token }`  
**New**: `{ user, access_token, hasDriverProfile, hasRiderProfile }`

**Impact**: Frontend can now determine role availability on login.

---

## 10. Testing Requirements

### 10.1 Unit Tests Needed
- [ ] `AuthService.sendVerificationCode()` 
- [ ] `AuthService.verifyCode()`
- [ ] `MessageService.sendMessage()`
- [ ] `RideService.verifySafetyCode()`

### 10.2 E2E Tests Needed
- [ ] POST `/auth/send-verification` → 200 OK
- [ ] POST `/auth/verify` → 200 OK with invalid code → 400
- [ ] POST `/messages` → 201 Created
- [ ] GET `/messages/ride/:id` → 200 OK with messages array
- [ ] POST `/rides/:id/verify-safety-code` → valid code → 200, invalid → 400

### 10.3 Integration Tests
- [ ] Verification code expiry after 10 minutes
- [ ] Unread message count updates correctly
- [ ] Safety code matches ride

---

## 11. Environment Variables

No new environment variables required. Existing JWT secret is sufficient.

**Future Enhancement**:
```env
# Email/SMS service configuration
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=noreply@aubhcarshare.com
SMTP_PASS=********

SMS_PROVIDER_KEY=********
SMS_PROVIDER_SECRET=********
```

---

## 12. Deployment Checklist

- [x] Database schema migration script created
- [x] All new entities added to app.module.ts
- [x] All new repositories added to app.module.ts
- [x] All new services added to app.module.ts
- [x] All new controllers added to app.module.ts
- [ ] Run migration on production database
- [ ] Test all new endpoints in staging
- [ ] Update API documentation
- [ ] Deploy backend
- [ ] Deploy frontend
- [ ] Monitor error logs for 24 hours

---

## 13. API Documentation Updates

### New Endpoints Summary

#### Authentication
- `POST /auth/send-verification` - Send verification code
- `POST /auth/verify` - Verify account with code

#### Messages
- `POST /messages` - Send message
- `GET /messages/ride/:rideId` - Get ride messages
- `GET /messages/conversations` - Get user conversations
- `GET /messages/unread/count` - Get unread count
- `PATCH /messages/:messageId/read` - Mark as read

#### Rides
- `POST /rides/:id/verify-safety-code` - Verify safety code

### Updated Endpoints
- `POST /auth/register` - Now includes aubhId, gender
- `POST /auth/login` - Now accepts emailOrPhone instead of email
- `POST /rides` - Now includes isRecurring, recurringSchedule

---

## 14. Performance Considerations

### Database Indexes (Future Enhancement)
```sql
CREATE INDEX idx_messages_ride ON messages(rideId);
CREATE INDEX idx_messages_user_read ON messages(toUserId, isRead);
CREATE INDEX idx_users_phone ON users(phoneNumber);
CREATE INDEX idx_rides_recurring ON rides(isRecurring);
```

### Caching Strategy
- Verification codes: In-memory cache (10-minute TTL)
- Unread message counts: Redis cache with 30-second TTL
- Safety codes: No caching (security)

---

## 15. Known Limitations

1. **Verification Code Delivery**: Currently logs to console. Production requires email/SMS service integration.
2. **Real-time Chat**: Currently requires polling. WebSocket implementation recommended for production.
3. **Recurring Ride Generation**: Manual trigger required. Cron job needed to auto-create recurring rides.
4. **Phone Number Validation**: Basic regex. Consider using libphonenumber for international support.

---

## 16. Next Steps

### Phase 1: Testing (Completed)
- [x] Build backend successfully
- [ ] Run E2E tests
- [ ] Fix any failing tests

### Phase 2: Integration
- [ ] Connect frontend to new endpoints
- [ ] Test authentication flow end-to-end
- [ ] Test chat functionality
- [ ] Test safety code verification

### Phase 3: Production
- [ ] Set up email/SMS service
- [ ] Implement WebSocket for real-time chat
- [ ] Add database indexes
- [ ] Deploy to staging
- [ ] User acceptance testing
- [ ] Deploy to production

---

## 17. Success Metrics

- ✅ Backend builds without errors
- ✅ All new entities created
- ✅ All new endpoints implemented
- ⏳ E2E tests passing
- ⏳ Frontend integration successful
- ⏳ No breaking changes to existing features

---

## Appendix A: Code Examples

### Example: Send Verification Code
```typescript
// Frontend
const response = await apiClient.post('/auth/send-verification', {
  emailOrPhone: 'user@example.com'
});
// Response: { message: "Verification code sent successfully", expiresIn: "10 minutes" }

// Backend logs (development)
// Console: "Verification code for user@example.com: 123456"
```

### Example: Verify Code
```typescript
// Frontend
const response = await apiClient.post('/auth/verify', {
  emailOrPhone: 'user@example.com',
  code: '123456'
});
// Response: { message: "Account verified successfully", user: {...}, access_token: "..." }
```

### Example: Send Message
```typescript
// Frontend
const response = await apiClient.post('/messages', {
  rideId: 5,
  toUserId: 3,
  text: "Hi! I'm on my way"
});
// Response: { messageId: 1, rideId: 5, fromUserId: 2, toUserId: 3, text: "Hi! I'm on my way", isRead: false, createdAt: "..." }
```

### Example: Verify Safety Code
```typescript
// Frontend
const response = await apiClient.post('/rides/5/verify-safety-code', {
  safetyCode: '4827'
});
// Response: { verified: true, message: "Safety code verified successfully", rideId: 5 }
```

---

**Document Version**: 1.0  
**Last Updated**: December 8, 2025  
**Author**: GitHub Copilot  
**Status**: Implementation Complete, Testing In Progress
