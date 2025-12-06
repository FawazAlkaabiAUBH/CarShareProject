# Backend Documentation

## Overview

The CarShare backend is built with **NestJS 11.0.1** and TypeScript, providing a REST API for managing carpooling operations at AUBH. The system uses in-memory storage for rapid prototyping and development.

## Architecture

The backend follows a **layered architecture** pattern:

```
Controllers → Services → Repositories → Entities
```

### Layers

1. **Entities**: Domain models representing core business objects
2. **Repositories**: Data access layer with in-memory storage using `Map<number, Entity>`
3. **Services**: Business logic layer
4. **Controllers**: REST API endpoints with request/response handling

## Technology Stack

- **Framework**: NestJS 11.0.1
- **Language**: TypeScript 5.7.3
- **Runtime**: Node.js
- **Testing**: Jest 30.0.0 + Supertest 7.0.0
- **Database**: SQLite (better-sqlite3) - File-based persistent storage
- **Port**: 3000

## Project Structure

```
api/
├── src/
│   ├── entities/         # Domain models
│   │   ├── user.entity.ts
│   │   ├── driver.entity.ts
│   │   ├── rider.entity.ts
│   │   ├── ride.entity.ts
│   │   ├── booking.entity.ts
│   │   └── rating.entity.ts
│   ├── dto/              # Data Transfer Objects
│   │   ├── user.dto.ts
│   │   ├── driver.dto.ts
│   │   ├── rider.dto.ts
│   │   ├── ride.dto.ts
│   │   ├── booking.dto.ts
│   │   └── rating.dto.ts
│   ├── repositories/     # Data access layer
│   │   ├── user.repository.ts
│   │   ├── driver.repository.ts
│   │   ├── rider.repository.ts
│   │   ├── ride.repository.ts
│   │   ├── booking.repository.ts
│   │   └── rating.repository.ts
│   ├── services/         # Business logic
│   │   ├── user.service.ts
│   │   ├── driver.service.ts
│   │   ├── rider.service.ts
│   │   ├── ride.service.ts
│   │   ├── booking.service.ts
│   │   └── rating.service.ts
│   ├── controllers/      # REST endpoints
│   │   ├── user.controller.ts
│   │   ├── driver.controller.ts
│   │   ├── rider.controller.ts
│   │   ├── ride.controller.ts
│   │   ├── booking.controller.ts
│   │   └── rating.controller.ts
│   ├── app.module.ts     # Main application module
│   └── main.ts           # Application entry point
├── test/                 # E2E tests
│   ├── app.e2e-spec.ts
│   ├── users.e2e-spec.ts
│   ├── drivers.e2e-spec.ts
│   ├── riders.e2e-spec.ts
│   ├── rides.e2e-spec.ts
│   ├── bookings.e2e-spec.ts
│   └── ratings.e2e-spec.ts
└── package.json
```

## Core Entities

### User
- **Purpose**: Base user account information
- **Key Fields**: userId, name, email, phoneNumber, role, accountStatus
- **Roles**: DRIVER, RIDER, ADMIN
- **Status**: ACTIVE, INACTIVE, SUSPENDED

### Driver
- **Purpose**: Driver-specific information and metrics
- **Key Fields**: driverId, userId, vehicleInfo, licenseNumber, rating, totalRides
- **Verification**: isVerified flag

### Rider
- **Purpose**: Rider-specific information and preferences
- **Key Fields**: riderId, userId, preferredPickupLocation, rating, totalRides

### Ride
- **Purpose**: Individual ride/trip information
- **Key Fields**: rideId, driverId, riderId, pickupLocation, dropoffLocation, pickupTime, fareEstimate, availableSeats
- **Status**: AVAILABLE, BOOKED, IN_PROGRESS, COMPLETED, CANCELLED

### Booking
- **Purpose**: Reservation and booking management
- **Key Fields**: bookingId, rideId, riderId, seatsBooked, totalFare
- **Status**: PENDING, CONFIRMED, CANCELLED, COMPLETED

### Rating
- **Purpose**: Review and feedback system
- **Key Fields**: ratingId, rideId, raterId, rateeId, score (1-5), comment
- **Moderation**: isFlagged, feedbackTags

## API Endpoints

### User Endpoints (`/users`)

| Method | Endpoint | Description | Status Code |
|--------|----------|-------------|-------------|
| GET | `/users` | Get all users | 200 |
| GET | `/users/:id` | Get user by ID | 200 |
| POST | `/users` | Create new user | 200 |
| PATCH | `/users/:id` | Update user | 200 |
| DELETE | `/users/:id` | Delete user | 200 |
| POST | `/users/login` | User login | 200 |
| GET | `/users/search?q=` | Search users | 200 |

### Driver Endpoints (`/drivers`)

| Method | Endpoint | Description | Status Code |
|--------|----------|-------------|-------------|
| GET | `/drivers` | Get all drivers | 200 |
| GET | `/drivers/:id` | Get driver by ID | 200 |
| POST | `/drivers` | Create driver profile | 200 |
| PATCH | `/drivers/:id` | Update driver | 200 |
| DELETE | `/drivers/:id` | Delete driver | 200 |
| PATCH | `/drivers/:id/verify` | Verify driver | 200 |
| PATCH | `/drivers/:id/rating` | Update driver rating | 200 |

### Rider Endpoints (`/riders`)

| Method | Endpoint | Description | Status Code |
|--------|----------|-------------|-------------|
| GET | `/riders` | Get all riders | 200 |
| GET | `/riders/:id` | Get rider by ID | 200 |
| POST | `/riders` | Create rider profile | 200 |
| PATCH | `/riders/:id` | Update rider | 200 |
| DELETE | `/riders/:id` | Delete rider | 200 |
| PATCH | `/riders/:id/rating` | Update rider rating | 200 |

### Ride Endpoints (`/rides`)

| Method | Endpoint | Description | Status Code |
|--------|----------|-------------|-------------|
| GET | `/rides` | Get all rides | 200 |
| GET | `/rides/:id` | Get ride by ID | 200 |
| POST | `/rides` | Create new ride | 200 |
| PATCH | `/rides/:id` | Update ride | 200 |
| DELETE | `/rides/:id` | Delete ride | 200 |
| GET | `/rides/available` | Search available rides | 200 |
| PATCH | `/rides/:id/status` | Update ride status | 200 |

### Booking Endpoints (`/bookings`)

| Method | Endpoint | Description | Status Code |
|--------|----------|-------------|-------------|
| GET | `/bookings` | Get all bookings | 200 |
| GET | `/bookings/:id` | Get booking by ID | 200 |
| POST | `/bookings` | Create new booking | 200 |
| PATCH | `/bookings/:id` | Update booking | 200 |
| DELETE | `/bookings/:id` | Delete booking | 200 |
| POST | `/bookings/:id/confirm` | Confirm booking | 200 |
| POST | `/bookings/:id/cancel` | Cancel booking | 200 |
| POST | `/bookings/:id/complete` | Complete booking | 200 |

### Rating Endpoints (`/ratings`)

| Method | Endpoint | Description | Status Code |
|--------|----------|-------------|-------------|
| GET | `/ratings` | Get all ratings | 200 |
| GET | `/ratings/:id` | Get rating by ID | 200 |
| POST | `/ratings` | Create new rating | 200 |
| PATCH | `/ratings/:id` | Update rating | 200 |
| DELETE | `/ratings/:id` | Delete rating | 200 |
| GET | `/ratings/ride/:rideId` | Get ratings for a ride | 200 |
| PATCH | `/ratings/:id/flag` | Flag/unflag rating | 200 |

## Data Storage

The backend uses **SQLite** for persistent file-based storage:

```typescript
// Database file location: api/data.db
Database: SQLite with better-sqlite3
Schema: 6 tables (users, drivers, riders, rides, bookings, ratings)
Indexes: Optimized for common queries
```

### Database Schema

**Users Table**
```sql
CREATE TABLE users (
  userId INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phoneNumber TEXT,
  role TEXT CHECK(role IN ('DRIVER', 'RIDER', 'ADMIN')),
  accountStatus TEXT CHECK(accountStatus IN ('ACTIVE', 'INACTIVE', 'SUSPENDED')),
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL,
  lastLogin TEXT
)
```

**Drivers Table**
```sql
CREATE TABLE drivers (
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
```

**Riders Table**
```sql
CREATE TABLE riders (
  riderId INTEGER PRIMARY KEY AUTOINCREMENT,
  userId INTEGER NOT NULL UNIQUE,
  preferredPickupLocation TEXT,
  rating REAL DEFAULT 0,
  totalRides INTEGER DEFAULT 0,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL,
  FOREIGN KEY (userId) REFERENCES users(userId) ON DELETE CASCADE
)
```

**Rides Table**
```sql
CREATE TABLE rides (
  rideId INTEGER PRIMARY KEY AUTOINCREMENT,
  driverId INTEGER NOT NULL,
  riderId INTEGER,
  pickupLocation TEXT NOT NULL,
  dropoffLocation TEXT NOT NULL,
## Testing

### Test Coverage
- **Total Tests**: 44 tests across 7 test suites
- **Passing**: 26 tests (59%) with SQLite integration
- **Status**: Core CRUD operations verified, test isolation needed

### Running Tests

```bash
# Run all E2E tests
pnpm test:e2e

# Run specific test file
pnpm test:e2e -- users.e2e-spec.ts

# Watch mode
pnpm test:e2e -- --watch

# View database during tests
sqlite3 data.db "SELECT * FROM users;"
```otalFare REAL NOT NULL,
  bookingStatus TEXT CHECK(bookingStatus IN ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED')),
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL,
  FOREIGN KEY (rideId) REFERENCES rides(rideId) ON DELETE CASCADE
)
```

**Ratings Table**
```sql
CREATE TABLE ratings (
  ratingId INTEGER PRIMARY KEY AUTOINCREMENT,
  rideId INTEGER NOT NULL,
  raterId INTEGER NOT NULL,
  rateeId INTEGER NOT NULL,
  score INTEGER CHECK(score >= 1 AND score <= 5),
  comment TEXT,
  isFlagged INTEGER DEFAULT 0,
  feedbackTags TEXT,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL,
  FOREIGN KEY (rideId) REFERENCES rides(rideId) ON DELETE CASCADE
)
```

### Seed Data

The database is automatically seeded on first run:

- **Users**: 3 test users (Ahmed Ali, Fatima Hassan, Mohammed Khalid)
- **Drivers**: 2 drivers linked to users
- **Riders**: 1 rider linked to a user
- **Rides**: 1 available ride for tomorrow
- **Bookings**: Empty initially
- **Ratings**: Empty initially

### Data Persistence

✅ **Persistent Storage**: All data is saved to `api/data.db` file and persists across server restarts.

**Database Location**: `d:\Stuff\GitHub\CarShareProject\api\data.db`

**Benefits**:
- ✅ Data survives server restarts
- ✅ Fast local development
- ✅ No external dependencies
- ✅ Easy to migrate to PostgreSQL/MySQL for production
- ✅ Perfect for prototyping and testing

## Business Logic

### Ride Creation Flow
1. Service validates driver exists
2. Estimates fare if not provided (distance × rate)
3. Repository saves ride with AVAILABLE status
4. Driver's total rides incremented

### Booking Flow
1. Validate ride exists and has available seats
2. Calculate total fare (seatsBooked × ride.fareEstimate)
3. Create booking with PENDING status
4. Decrement available seats on ride
5. Update ride status to BOOKED if no seats remain

### Rating System
- Scores range from 1-5
- Automatically updates driver/rider average ratings
- Supports flagging for moderation
- Feedback tags for categorization

### Fare Estimation
```typescript
estimateFare(distance: number): number {
  const baseRate = 0.5; // BD per km
  return distance * baseRate;
}
```

## Authentication

Currently uses **hardcoded authentication** for prototyping:

```typescript
// login endpoint returns success if email exists
const user = await this.userRepository.findByEmail(email);
if (!user) {
  throw new HttpException('Invalid credentials', 401);
}
```

⚠️ **TODO**: Implement proper JWT-based authentication with password hashing for production.

## Testing

### Test Coverage
- **Total Tests**: 44 tests across 7 test suites
- **Passing**: 40 tests (90.9%)
- **Status**: All CRUD operations verified, 4 edge cases pending

### Running Tests

```bash
# Run all E2E tests
pnpm test:e2e

# Run specific test file
pnpm test:e2e -- users.e2e-spec.ts

# Watch mode
pnpm test:e2e -- --watch
```

### Test Structure
Each test suite includes:
- CRUD operations (Create, Read, Update, Delete)
- Search/filter operations
- Business logic validation
- Error handling scenarios

## Development Commands

```bash
# Install dependencies
pnpm install

# Start development server
pnpm start:dev

# Build for production
pnpm build

# Run tests
pnpm test:e2e

# Lint code
pnpm lint

# Format code
pnpm format
```

## CORS Configuration

CORS is enabled for frontend development:

```typescript
app.enableCors({
  origin: 'http://localhost:8000', // Next.js frontend
  credentials: true,
});
```

## Error Handling

The API uses standard HTTP status codes:

- **200**: Success
- **400**: Bad Request (validation errors)
- **404**: Not Found
- **500**: Internal Server Error

Example error response:
```json
{
  "statusCode": 404,
  "message": "User not found"
}
```

## Future Enhancements

### Priority 1: Production Readiness
- [x] Replace in-memory storage with SQLite ✅ **COMPLETED**
- [ ] Add test database isolation (separate DB per test)
- [ ] Implement JWT authentication and authorization
- [ ] Add password hashing (bcrypt)
- [ ] Environment configuration (.env files)
- [ ] Proper logging (Winston/Pino)
- [ ] Migrate to PostgreSQL/MySQL for production

### Priority 2: Features
- [ ] Real-time notifications (WebSocket/Socket.io)
- [ ] Payment integration
- [ ] Email verification
- [ ] SMS notifications for ride updates
- [ ] Advanced search filters
- [ ] Route optimization

### Priority 3: Quality
- [ ] Unit tests for services
- [ ] API documentation (Swagger/OpenAPI)
- [ ] Rate limiting
- [ ] Input validation with class-validator
- [ ] Request/response DTOs validation
- [ ] Database migrations

## Dependencies

### Core Dependencies
```json
{
  "@nestjs/common": "^11.0.1",
  "@nestjs/core": "^11.0.1",
  "@nestjs/platform-express": "^11.0.1",
  "better-sqlite3": "^12.5.0",
  "reflect-metadata": "^0.2.2",
  "rxjs": "^7.8.1"
}
```

### Development Dependencies
```json
{
  "@nestjs/testing": "^11.0.1",
  "@types/better-sqlite3": "^7.6.13",
  "@types/jest": "^29.5.14",
  "@types/supertest": "^6.0.2",
  "jest": "^30.0.0-alpha.6",
  "supertest": "^7.0.0",
  "typescript": "^5.7.3"
}
```

## Support

For questions or issues:
- Check the `/test` directory for usage examples
- Review entity definitions in `/src/entities`
- Examine service logic in `/src/services`

## License

MIT License - See LICENSE file for details
