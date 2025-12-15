# AUBH CarShare - Front-End Implementation

## Overview
This is a modern carpooling mobile app for the American University of Bahrain, built with Next.js 16, React 19, TypeScript, and Tailwind CSS. The app features a dark theme and supports both Driver and Rider roles.

## Technology Stack
- **Framework**: Next.js 16.0.6 (App Router)
- **React**: 19.2.0
- **TypeScript**: 5.x
- **Styling**: Tailwind CSS 4.x
- **Icons**: Lucide React
- **Maps**: React Leaflet
- **HTTP Client**: Axios

## Project Structure

```
web/
├── app/                                 # Next.js App Router pages
│   ├── page.tsx                        # Welcome screen (1/29)
│   ├── login/page.tsx                  # Login screen (2/29)
│   ├── signup/page.tsx                 # Signup screen (3/29)
│   ├── verification/page.tsx           # Verification code screen (4/29)
│   ├── role-selection/page.tsx         # Role selection screen (5/29)
│   ├── dashboard/
│   │   ├── driver/page.tsx            # Driver dashboard (6/29)
│   │   └── rider/page.tsx             # Rider dashboard (7/29)
│   ├── driver/
│   │   ├── car-registration/page.tsx  # Car registration (8/29)
│   │   └── post-ride/page.tsx         # Post ride form (9/29)
│   ├── rider/
│   │   ├── ride-request/page.tsx      # Ride request form (13/29)
│   │   └── available-drivers/page.tsx # Available drivers list (14/29)
│   ├── profile/page.tsx               # User profile (22/29)
│   ├── notifications/page.tsx         # Notifications (23/29)
│   ├── ride-history/page.tsx          # Ride history (24/29)
│   ├── settings/page.tsx              # Settings (25/29)
│   ├── scheduled-rides/page.tsx       # Scheduled rides (26/29)
│   ├── safety/page.tsx                # Safety center (27/29)
│   ├── chat/page.tsx                  # In-app chat (28/29)
│   ├── payment-method/page.tsx        # Payment method selection (19/29)
│   ├── payment-success/page.tsx       # Payment confirmation (20/29)
│   └── feedback/page.tsx              # Post-ride feedback (21/29)
├── components/
│   ├── ui/                            # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   └── IconButton.tsx
│   ├── LocationPicker.tsx             # Location selection component
│   ├── PaymentMethodSelector.tsx     # Payment method picker
│   ├── SafetyCodeDisplay.tsx         # Safety code display
│   ├── FareSummary.tsx               # Fare breakdown
│   └── NotificationBell.tsx          # Notification icon
├── lib/
│   ├── api.ts                        # Axios client configuration
│   ├── types/index.ts                # TypeScript type definitions
│   ├── contexts/
│   │   ├── AuthContext.tsx           # Authentication context
│   │   └── NotificationContext.tsx   # Notification context
│   └── hooks/                        # Custom React hooks
└── app/globals.css                   # Global styles & Tailwind config
```

## Screen Flow

### Authentication Flow
1. **Welcome** (`/`) - Landing page with app logo and CTAs
2. **Login** (`/login`) - Email/phone and password login
3. **Signup** (`/signup`) - User registration form
4. **Verification** (`/verification`) - 6-digit code verification
5. **Role Selection** (`/role-selection`) - Choose Driver or Rider mode

### Driver Flow
1. **Driver Dashboard** (`/dashboard/driver`) - Stats, quick actions
2. **Car Registration** (`/driver/car-registration`) - Add vehicle details
3. **Post Ride** (`/driver/post-ride`) - Create new ride offering
4. Matching & In-Ride screens (to be completed)

### Rider Flow
1. **Rider Dashboard** (`/dashboard/rider`) - Stats, quick actions
2. **Ride Request** (`/rider/ride-request`) - Search for rides
3. **Available Drivers** (`/rider/available-drivers`) - Browse drivers
4. Matching & In-Ride screens (to be completed)

### Shared Screens
- **Profile** (`/profile`) - User information and stats
- **Settings** (`/settings`) - App preferences
- **Safety** (`/safety`) - Emergency contacts and SOS
- **Chat** (`/chat`) - Direct messaging
- **Ride History** (`/ride-history`) - Past rides
- **Notifications** (`/notifications`) - Activity feed
- **Scheduled Rides** (`/scheduled-rides`) - Recurring rides
- **Payment Method** (`/payment-method`) - Choose payment
- **Payment Success** (`/payment-success`) - Confirmation
- **Feedback** (`/feedback`) - Rate and review

## Key Features Implemented

### Authentication & Authorization
- JWT-based authentication
- Email/phone verification
- Role-based access (Driver/Rider)
- Role switching from dashboard

### User Interface
- Dark theme matching Figma design
- Responsive mobile-first layout
- iPhone-style dynamic island
- Smooth transitions and animations
- Gradient backgrounds and glass-morphism

### Core Functionality
- User registration and login
- Vehicle registration for drivers
- Ride posting and searching
- Real-time chat interface
- Payment method selection
- Rating and feedback system
- Safety features and emergency contacts
- Notification system
- Ride history tracking

## Data Models

### User
```typescript
interface User {
  userId: number;
  name: string;
  email: string;
  phoneNumber?: string;
  aubhId?: string;
  gender?: 'MALE' | 'FEMALE';
  role: 'DRIVER' | 'RIDER' | 'ADMIN';
  rating?: number;
  totalRides?: number;
}
```

### Ride
```typescript
interface Ride {
  rideId: number;
  userId: number;
  origin: string;
  destination: string;
  departureTime: string;
  availableSeats: number;
  safetyCode?: string;
  rideStatus: 'OPEN' | 'AVAILABLE' | 'BOOKED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
}
```

### Car
```typescript
interface Car {
  carId?: number;
  make: string;
  model: string;
  year: number;
  color: string;
  licensePlate: string;
}
```

## API Integration

The app uses Axios for HTTP requests with:
- Base URL configuration
- JWT token interceptor
- Automatic token refresh
- Error handling

### API Endpoints Used
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/verify` - Code verification
- `POST /rides` - Create new ride
- `GET /rides/available` - Search rides
- `POST /vehicles` - Register vehicle
- `POST /bookings` - Book a ride
- `POST /ratings` - Submit rating

## Running the Application

### Development
```bash
cd web
pnpm install
pnpm dev
```
The app runs on http://localhost:8000

### Build
```bash
pnpm build
pnpm start
```

## Environment Variables
Create a `.env.local` file:
```
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## Design System

### Colors
- **Primary**: #DC143C (Crimson)
- **Primary Dark**: #8B0000 (Dark Red)
- **Background**: #0A0E1A → #1A1D29 (Gradient)
- **Surface**: #101828
- **Text Primary**: #FFFFFF
- **Text Secondary**: #D1D5DC
- **Text Muted**: #99A1AF
- **Text Disabled**: #6A7282

### Typography
- **Font Family**: Inter
- **Headings**: 24-60px, Medium weight
- **Body**: 18px, Normal weight
- **Small**: 14-16px

### Spacing
- **Border Radius**: 18px, 27px for cards
- **Padding**: 27px (page), 6px (sections)
- **Gaps**: 18px, 27px

### Components
- **Buttons**: Gradient backgrounds, 72px height
- **Inputs**: 54-63px height, dark background
- **Cards**: Glass-morphism with gradients
- **Icons**: Lucide React, 24-36px

## Next Steps

### To Complete
1. **Matching Screens**
   - Driver Match Found (11/29)
   - Rider Match Found (15/29)
   - Matching Loader (10/29)

2. **In-Ride Screens**
   - Driver In-Ride (12/29)
   - Rider In-Ride (16/29)
   - Map View (29/29)

3. **Fare Summary Screens**
   - Rider Fare Summary (17/29)
   - Driver Fare Summary (18/29)

4. **Additional Features**
   - Real-time chat with Socket.io
   - Live location tracking
   - Push notifications
   - Photo upload for profile
   - Payment gateway integration

## Testing
- Test all navigation flows
- Verify form validations
- Test API error handling
- Check responsive design
- Validate accessibility

## Notes
- All screens follow the Figma design specifications
- Dynamic Island is included for iPhone-style UI
- Navigation uses Next.js App Router
- State management via Context API
- All screens are mobile-optimized
- Dark theme is default and persistent

## Support
For issues or questions, contact the development team.
