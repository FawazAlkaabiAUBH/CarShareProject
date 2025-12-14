# API Integration Examples

This document provides complete code examples for key API integrations in the AUBH CarShare application.

## 1. Authentication

### User Registration
```typescript
// web/app/signup/page.tsx
import { apiClient } from '@/lib/api';

const handleSignup = async (formData) => {
  try {
    await apiClient.post('/auth/register', {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      phoneNumber: formData.phoneNumber,
      aubhId: formData.aubhId,
      gender: formData.gender, // 'MALE' | 'FEMALE'
      benefitPayPhone: formData.benefitPayPhone, // Optional, 8 digits
    });
    
    // Navigate to verification
    router.push(`/verification?contact=${encodeURIComponent(formData.email)}`);
  } catch (error) {
    console.error('Signup failed:', error);
    setError(error.response?.data?.message || 'Signup failed');
  }
};
```

### User Login
```typescript
// web/app/login/page.tsx
import { apiClient } from '@/lib/api';
import { useAuth } from '@/lib/contexts/AuthContext';

const handleLogin = async (credentials) => {
  try {
    const response = await apiClient.post('/auth/login', {
      emailOrPhone: credentials.emailOrPhone,
      password: credentials.password,
    });

    const { access_token, user } = response.data;
    login(user, access_token); // Stores in localStorage
    
    router.push('/role-selection');
  } catch (error) {
    console.error('Login failed:', error);
    setError(error.response?.data?.message || 'Invalid credentials');
  }
};
```

## 2. Ride Management

### Create Ride (Driver)
```typescript
// web/app/driver/post-ride/page.tsx
import { ridesApi, vehiclesApi } from '@/lib/api';

const handleCreateRide = async () => {
  try {
    // Get active vehicle
    const vehicles = await vehiclesApi.getMyActiveVehicles();
    if (!vehicles || vehicles.length === 0) {
      throw new Error('Please register a vehicle first');
    }

    // Create ride
    const ride = await ridesApi.createRide({
      vehicleId: vehicles[0].vehicleId,
      origin: 'AUBH', // Or user location name
      destination: 'Seef Mall', // Or AUBH
      originLat: 26.1008012,
      originLng: 50.5480834,
      destinationLat: 26.2361,
      destinationLng: 50.5339,
      departureTime: '2025-12-15T14:30:00Z',
      totalSeats: 4,
      estimatedDuration: 25, // Optional, in minutes
    });

    // Navigate to matching
    router.push(`/driver/matching?rideId=${ride.rideId}`);
  } catch (error) {
    console.error('Failed to create ride:', error);
    setError(error.response?.data?.message || 'Failed to create ride');
  }
};
```

### Search Rides (Rider)
```typescript
// web/app/rider/ride-request/page.tsx
import { ridesApi } from '@/lib/api';

const handleSearchRides = async () => {
  try {
    // Search rides near user location going to AUBH
    const rides = await ridesApi.searchRides({
      lat: userLocation.lat,
      lng: userLocation.lng,
      destLat: 26.1008012, // AUBH
      destLng: 50.5480834,
      maxPickupDistance: 5, // km
      maxDropoffDistance: 5, // km
      startDate: pickupTime,
    });

    if (rides.length === 0) {
      setError('No available rides found');
      return;
    }

    // Navigate to available drivers
    router.push('/rider/available-drivers');
  } catch (error) {
    console.error('Failed to search rides:', error);
    setError('Failed to search rides');
  }
};
```

## 3. Booking Management

### Create Booking
```typescript
// web/app/rider/match-found/page.tsx
import { bookingsApi } from '@/lib/api';

const handleBookRide = async () => {
  try {
    const booking = await bookingsApi.createBooking({
      rideId: selectedRide.rideId,
      seatsBooked: 1,
      paymentMethod: 'BENEFITPAY', // or 'CASH'
      benefitPayPhone: '12345678', // Required if BENEFITPAY
    });

    // Navigate to ride in progress
    router.push(`/rider/ride-in-progress?bookingId=${booking.bookingId}&rideId=${selectedRide.rideId}`);
  } catch (error) {
    console.error('Failed to create booking:', error);
    alert('Booking failed. Please try again.');
  }
};
```

### Accept Booking (Driver)
```typescript
// web/app/driver/matching/page.tsx
import { bookingsApi } from '@/lib/api';

const handleAcceptRider = async (bookingId: number) => {
  try {
    await bookingsApi.updateBookingStatus(bookingId, {
      status: 'CONFIRMED',
    });

    // Navigate to ride in progress
    router.push(`/driver/ride-in-progress?rideId=${rideId}`);
  } catch (error) {
    console.error('Failed to accept rider:', error);
    alert('Failed to accept rider. Please try again.');
  }
};
```

### Cancel Booking
```typescript
import { bookingsApi } from '@/lib/api';

const handleCancelBooking = async (bookingId: number) => {
  try {
    await bookingsApi.cancelBooking(bookingId, 'Changed plans');
    
    // Refresh bookings list
    const updatedBookings = await bookingsApi.getMyBookings();
    setBookings(updatedBookings);
  } catch (error) {
    console.error('Failed to cancel booking:', error);
    alert('Failed to cancel booking.');
  }
};
```

## 4. Ride Status Updates

### Start Ride
```typescript
// web/app/driver/ride-in-progress/page.tsx
import { ridesApi } from '@/lib/api';

const handleStartRide = async () => {
  try {
    const updatedRide = await ridesApi.startRide(rideId);
    setRideStatus('started');
    console.log('Ride started:', updatedRide);
  } catch (error) {
    console.error('Failed to start ride:', error);
    alert('Failed to start ride. Please try again.');
  }
};
```

### Complete Ride
```typescript
// web/app/driver/ride-in-progress/page.tsx
import { ridesApi } from '@/lib/api';

const handleCompleteRide = async () => {
  try {
    const completedRide = await ridesApi.completeRide(rideId);
    
    // Navigate to fare summary
    router.push(`/driver/fare-summary?rideId=${rideId}`);
  } catch (error) {
    console.error('Failed to complete ride:', error);
    alert('Failed to complete ride. Please try again.');
  }
};
```

## 5. Rating System

### Submit Rating
```typescript
// web/app/feedback/page.tsx
import { ratingsApi } from '@/lib/api';

const handleSubmitRating = async () => {
  try {
    await ratingsApi.createRating({
      rideId: rideId,
      rateeId: driverId, // The person being rated
      score: rating, // 1-5
      comment: comment || undefined,
      feedbackTags: selectedTips.join(','), // Optional
    });

    // Navigate to dashboard
    router.push('/dashboard/rider');
  } catch (error) {
    console.error('Failed to submit rating:', error);
    alert('Failed to submit rating. Please try again.');
  }
};
```

### Get Average Rating
```typescript
import { ratingsApi } from '@/lib/api';

const fetchUserRating = async (userId: number) => {
  try {
    const ratingData = await ratingsApi.getUserAverageRating(userId);
    console.log(`Average rating: ${ratingData.averageRating}`);
    console.log(`Total ratings: ${ratingData.totalRatings}`);
    return ratingData;
  } catch (error) {
    console.error('Failed to fetch rating:', error);
    return { averageRating: 5.0, totalRatings: 0 };
  }
};
```

## 6. Profile & Statistics

### Fetch Driver Stats
```typescript
// web/app/dashboard/driver/page.tsx
import { driversApi, ridesApi, ratingsApi } from '@/lib/api';

const fetchDriverStats = async (userId: number) => {
  try {
    const [driverProfile, driverRides, ratingData] = await Promise.all([
      driversApi.getDriverByUserId(userId),
      ridesApi.getRidesByDriver(userId),
      ratingsApi.getUserAverageRating(userId),
    ]);

    // Calculate this week's rides
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const thisWeekRides = driverRides.filter(
      ride => new Date(ride.createdAt || '') > oneWeekAgo && ride.rideStatus === 'COMPLETED'
    );

    // Calculate total earnings
    const totalEarnings = driverRides
      .filter(ride => ride.rideStatus === 'COMPLETED')
      .reduce((sum, ride) => sum + (ride.driverEarnings || 0), 0);

    return {
      totalRides: driverProfile.totalRides || 0,
      thisWeek: thisWeekRides.length,
      earned: totalEarnings.toFixed(2),
      rating: ratingData.averageRating || driverProfile.rating || 5.0,
    };
  } catch (error) {
    console.error('Failed to fetch driver stats:', error);
    return { totalRides: 0, thisWeek: 0, earned: '0.00', rating: 5.0 };
  }
};
```

### Fetch Rider Stats
```typescript
// web/app/dashboard/rider/page.tsx
import { ridersApi, bookingsApi, ratingsApi } from '@/lib/api';

const fetchRiderStats = async (userId: number) => {
  try {
    const [riderProfile, myBookings, ratingData] = await Promise.all([
      ridersApi.getRiderByUserId(userId),
      bookingsApi.getMyBookings(),
      ratingsApi.getUserAverageRating(userId),
    ]);

    // Calculate this month's rides
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    const thisMonthBookings = myBookings.filter(
      booking => new Date(booking.createdAt || '') > oneMonthAgo && booking.bookingStatus === 'COMPLETED'
    );

    // Calculate total spent
    const totalSpent = myBookings
      .filter(booking => booking.bookingStatus === 'COMPLETED')
      .reduce((sum, booking) => sum + (booking.totalAmount || 0), 0);

    return {
      totalRides: riderProfile.totalRides || 0,
      thisMonth: thisMonthBookings.length,
      spent: totalSpent.toFixed(2),
      rating: ratingData.averageRating || riderProfile.rating || 5.0,
    };
  } catch (error) {
    console.error('Failed to fetch rider stats:', error);
    return { totalRides: 0, thisMonth: 0, spent: '0.00', rating: 5.0 };
  }
};
```

## 7. Notifications

### Fetch Notifications
```typescript
// web/app/notifications/page.tsx
import { notificationsApi } from '@/lib/api';

const fetchNotifications = async () => {
  try {
    const notifications = await notificationsApi.getMyNotifications();
    return notifications;
  } catch (error) {
    console.error('Failed to fetch notifications:', error);
    return [];
  }
};
```

### Get Unread Count
```typescript
import { notificationsApi } from '@/lib/api';

const fetchUnreadCount = async () => {
  try {
    const { count } = await notificationsApi.getUnreadCount();
    return count;
  } catch (error) {
    console.error('Failed to fetch unread count:', error);
    return 0;
  }
};
```

### Mark All as Read
```typescript
import { notificationsApi } from '@/lib/api';

const handleMarkAllAsRead = async () => {
  try {
    await notificationsApi.markAllAsRead();
    // Refresh notifications
    const updated = await notificationsApi.getMyNotifications();
    setNotifications(updated);
  } catch (error) {
    console.error('Failed to mark all as read:', error);
  }
};
```

## 8. Vehicle Management

### Register Vehicle
```typescript
import { vehiclesApi } from '@/lib/api';

const handleRegisterVehicle = async (vehicleData) => {
  try {
    const vehicle = await vehiclesApi.createVehicle({
      make: vehicleData.make,
      model: vehicleData.model,
      year: vehicleData.year,
      color: vehicleData.color,
      licensePlate: vehicleData.licensePlate,
      vehicleDocument: vehicleData.document, // Optional
    });

    console.log('Vehicle registered:', vehicle);
    return vehicle;
  } catch (error) {
    console.error('Failed to register vehicle:', error);
    throw error;
  }
};
```

### Get Active Vehicles
```typescript
import { vehiclesApi } from '@/lib/api';

const fetchMyVehicles = async () => {
  try {
    const vehicles = await vehiclesApi.getMyActiveVehicles();
    return vehicles;
  } catch (error) {
    console.error('Failed to fetch vehicles:', error);
    return [];
  }
};
```

## 9. Error Handling Pattern

### Comprehensive Error Handling
```typescript
const handleApiCall = async () => {
  setLoading(true);
  setError('');

  try {
    const result = await apiClient.post('/endpoint', data);
    setSuccess(true);
    return result.data;
  } catch (error: any) {
    console.error('API call failed:', error);
    
    // Handle specific error cases
    if (error.response) {
      // Server responded with error
      const message = error.response.data?.message || 'Operation failed';
      setError(message);
      
      if (error.response.status === 401) {
        // Unauthorized - redirect to login
        router.push('/login');
      } else if (error.response.status === 404) {
        // Not found
        setError('Resource not found');
      } else if (error.response.status === 400) {
        // Validation error
        setError(message);
      }
    } else if (error.request) {
      // Request made but no response
      setError('Network error. Please check your connection.');
    } else {
      // Something else happened
      setError('An unexpected error occurred.');
    }
    
    throw error;
  } finally {
    setLoading(false);
  }
};
```

## 10. Complete Flow Example

### Complete Ride Booking Flow
```typescript
// Complete flow from search to booking to completion
import { ridesApi, bookingsApi, ratingsApi } from '@/lib/api';

const completeRideFlow = async () => {
  try {
    // 1. Search for rides
    const rides = await ridesApi.searchRides({
      lat: 26.1008012,
      lng: 50.5480834,
      destLat: 26.2361,
      destLng: 50.5339,
      maxPickupDistance: 5,
      maxDropoffDistance: 5,
    });

    const selectedRide = rides[0];

    // 2. Create booking
    const booking = await bookingsApi.createBooking({
      rideId: selectedRide.rideId,
      seatsBooked: 1,
      paymentMethod: 'CASH',
    });

    console.log('Booking created:', booking);

    // 3. Wait for ride to complete (in real app, this would be user action)
    // ... ride happens ...

    // 4. Submit rating
    await ratingsApi.createRating({
      rideId: selectedRide.rideId,
      rateeId: selectedRide.userId, // Driver
      score: 5,
      comment: 'Great ride!',
      feedbackTags: 'Great driver,On time,Safe driving',
    });

    console.log('Rating submitted successfully');
    
    return true;
  } catch (error) {
    console.error('Flow failed:', error);
    return false;
  }
};
```

## Testing Tips

1. **Always wrap API calls in try-catch blocks**
2. **Provide loading states for better UX**
3. **Display user-friendly error messages**
4. **Log errors to console for debugging**
5. **Test with invalid data to verify validation**
6. **Test token expiration handling**
7. **Verify AUBH location requirement enforcement**

## Environment Variables

Make sure to set in `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

For production:
```env
NEXT_PUBLIC_API_URL=https://api.aubh-carshare.com
```
