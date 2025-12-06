# CarShare Frontend

Modern, mobile-first web application for the AUBH CarShare carpooling platform built with Next.js 16, React 19, and Tailwind CSS 4.

## 🎨 Design

The UI is based on the Figma design specifications with:
- **Color Scheme**: Dark theme with crimson (#DC143C) accents
- **Typography**: Inter font family
- **Components**: Modern glassmorphism UI with smooth animations
- **Responsive**: Mobile-first design optimized for iPhone 16 Pro Max

## 🚀 Features

### Authentication
- ✅ Welcome/Landing page
- ✅ Login page with email authentication
- ✅ Signup flow with role selection (Driver/Rider)
- ✅ SMS verification with number pad

### Dashboard
- ✅ Home screen with quick actions
- ✅ Ride statistics and booking overview
- ✅ Bottom navigation bar

### Rides
- ✅ Find rides with search and filters
- ✅ Offer rides with vehicle info
- ✅ Real-time ride tracking (planned)
- ✅ Booking management

### Profile
- ✅ User profile with stats
- ✅ Settings and preferences
- ✅ Payment methods (planned)
- ✅ Ride history

### Notifications
- ✅ Real-time notifications
- ✅ Booking requests
- ✅ Payment confirmations
- ✅ Review alerts

## 📁 Project Structure

```
web/
├── app/
│   ├── (auth)/              # Authentication pages
│   │   ├── login/
│   │   ├── signup/
│   │   └── verification/
│   ├── (dashboard)/         # Protected dashboard pages
│   │   ├── dashboard/
│   │   ├── find-ride/
│   │   ├── offer-ride/
│   │   ├── profile/
│   │   └── notifications/
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Welcome page
│   └── globals.css          # Global styles
├── components/
│   └── ui/                  # Reusable UI components
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Card.tsx
│       └── IconButton.tsx
├── lib/
│   ├── api.ts              # API client (Axios)
│   ├── hooks/              # Custom React hooks
│   │   └── useAuth.ts
│   └── types/              # TypeScript interfaces
│       └── index.ts
└── package.json
```

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19
- **Styling**: Tailwind CSS 4
- **HTTP Client**: Axios
- **Language**: TypeScript 5
- **Package Manager**: pnpm

## 📦 Installation

```bash
# Navigate to web directory
cd web

# Install dependencies
pnpm install
```

## 🏃 Running the App

```bash
# Development server (runs on port 8000)
pnpm dev

# Production build
pnpm build

# Start production server
pnpm start

# Linting
pnpm lint
```

The app will be available at [http://localhost:8000](http://localhost:8000)

## 🔌 API Integration

The frontend connects to the NestJS backend running on port 3000. The API base URL is configured in `lib/api.ts`:

```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
```

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## 🎯 Key Components

### Button
```tsx
<Button variant="primary" size="md" onClick={handleClick}>
  Get Started
</Button>
```

Variants: `primary`, `secondary`, `outline`, `ghost`
Sizes: `sm`, `md`, `lg`

### Input
```tsx
<Input
  label="Email"
  type="email"
  placeholder="your.email@aubh.edu.bh"
  icon={<EmailIcon />}
/>
```

### Card
```tsx
<Card variant="glass" onClick={handleClick}>
  <p>Card content</p>
</Card>
```

Variants: `default`, `glass`, `solid`

### IconButton
```tsx
<IconButton
  icon={<BackIcon />}
  size="md"
  onClick={handleBack}
/>
```

## 🎨 Design System

### Colors
```css
--color-primary: #dc143c           /* Crimson */
--color-primary-dark: #8b0000      /* Dark Red */
--color-background: #0a0e1a        /* Dark Blue */
--color-background-secondary: #1a1d29
--color-text-primary: #ffffff
--color-text-secondary: #d1d5dc
--color-text-muted: #99a1af
```

### Gradients
- Primary: `linear-gradient(180deg, #dc143c 0%, #8b0000 100%)`
- Blue-Red: `linear-gradient(180deg, #002d72 0%, #dc143c 100%)`
- Background: `linear-gradient(180deg, #0a0e1a 0%, #1a1d29 50%, #0f0a1a 100%)`

## 📱 Pages Overview

1. **Welcome** (`/`) - Landing page with app intro
2. **Login** (`/login`) - Email authentication
3. **Signup** (`/signup`) - Multi-step registration
4. **Verification** (`/verification`) - SMS code verification
5. **Dashboard** (`/dashboard`) - Main user dashboard
6. **Find Ride** (`/find-ride`) - Search available rides
7. **Offer Ride** (`/offer-ride`) - Create new ride
8. **Profile** (`/profile`) - User profile and settings
9. **Notifications** (`/notifications`) - Activity feed

## 🔐 Authentication Flow

1. User lands on welcome page
2. Chooses "Sign In" or "Get Started"
3. Enters credentials (email for login, full info for signup)
4. Verifies phone with SMS code
5. Redirected to dashboard
6. User data stored in localStorage

## 📄 License

MIT License - See LICENSE file for details

---

**Note**: Make sure the backend API is running on port 3000 before starting the frontend.
