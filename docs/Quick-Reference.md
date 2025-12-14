# Quick Reference Guide - AUBH CarShare

## 🚀 Getting Started

### Start Development Servers

**Backend:**
```bash
cd api
pnpm start:dev
```
Backend runs on: http://localhost:3000

**Frontend:**
```bash
cd web
pnpm dev
```
Frontend runs on: http://localhost:3001

---

## 📱 API Services Quick Reference

### Import API Services
```typescript
import { ridesApi, bookingsApi, ratingsApi, notificationsApi } from '@/lib/api';
```

### Common Operations

#### Create Ride
```typescript
const ride = await ridesApi.createRide({
  vehicleId: 1,
  origin: 'AUBH',
  destination: 'Seef Mall',
  originLat: 26.1008012,
  originLng: 50.5480834,
  destinationLat: 26.2361,
  destinationLng: 50.5339,
  departureTime: '2025-12-15T14:30:00Z',
  totalSeats: 4
});
```

#### Search Rides
```typescript
const rides = await ridesApi.searchRides({
  lat: 26.1008012,
  lng: 50.5480834,
  destLat: 26.2361,
  destLng: 50.5339,
  maxPickupDistance: 5,
  maxDropoffDistance: 5
});
```

#### Create Booking
```typescript
const booking = await bookingsApi.createBooking({
  rideId: 1,
  seatsBooked: 1,
  paymentMethod: 'CASH' // or 'BENEFITPAY'
});
```

#### Submit Rating
```typescript
await ratingsApi.createRating({
  rideId: 1,
  rateeId: 2,
  score: 5,
  comment: 'Great ride!'
});
```

---

## 🔐 Authentication

### Login
```typescript
import { apiClient } from '@/lib/api';
import { useAuth } from '@/lib/contexts/AuthContext';

const response = await apiClient.post('/auth/login', {
  emailOrPhone: 'user@aubh.edu.bh',
  password: 'password123'
});

const { access_token, user } = response.data;
login(user, access_token);
```

### Check Authentication
```typescript
const { user, isAuthenticated } = useAuth();

if (!isAuthenticated) {
  router.push('/login');
}
```

---

## 🗺️ AUBH Location

### AUBH Coordinates
```typescript
const AUBH_LOCATION = {
  lat: 26.1008012,
  lng: 50.5480834,
  address: 'AUBH'
};
```

### Direction Toggle
- `to-aubh`: User location → AUBH
- `from-aubh`: AUBH → User location

---

## 💳 Payment Methods

### Valid Payment Methods
- `CASH` - Cash payment
- `BENEFITPAY` - BenefitPay (requires 8-digit phone)

### Validation
```typescript
if (paymentMethod === 'BENEFITPAY') {
  // Must provide benefitPayPhone (8 digits)
  benefitPayPhone: '12345678'
}
```

---

## 📊 Status Enums

### Ride Status
- `AVAILABLE` - Ride posted, accepting bookings
- `BOOKED` - Ride has confirmed bookings
- `IN_PROGRESS` - Ride started
- `COMPLETED` - Ride finished
- `CANCELLED` - Ride cancelled

### Booking Status
- `PENDING` - Booking requested
- `CONFIRMED` - Booking accepted
- `COMPLETED` - Booking finished
- `CANCELLED` - Booking cancelled

---

## 🛠️ Common Patterns

### Fetch Data with Loading
```typescript
const [data, setData] = useState<any>(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState('');

useEffect(() => {
  const fetchData = async () => {
    try {
      const result = await apiService.getData();
      setData(result);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, []);
```

### Handle Form Submission
```typescript
const [loading, setLoading] = useState(false);
const [error, setError] = useState('');

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');
  setLoading(true);

  try {
    await apiService.submitData(formData);
    router.push('/success');
  } catch (err: any) {
    setError(err.response?.data?.message || 'Operation failed');
  } finally {
    setLoading(false);
  }
};
```

---

## 🎯 Common Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register user |
| POST | `/auth/login` | Login user |
| POST | `/rides` | Create ride |
| GET | `/rides/nearby/search` | Search rides |
| POST | `/bookings` | Create booking |
| PUT | `/bookings/:id/status` | Update booking |
| POST | `/ratings` | Submit rating |
| GET | `/notifications` | Get notifications |
| GET | `/drivers/user/:userId` | Get driver profile |
| GET | `/riders/user/:userId` | Get rider profile |

---

## 🔍 Debugging Tips

### Check Token
```typescript
const token = localStorage.getItem('access_token');
console.log('Token:', token);
```

### Check User
```typescript
const user = JSON.parse(localStorage.getItem('user') || '{}');
console.log('User:', user);
```

### Monitor API Calls
Open browser console → Network tab → Filter: XHR

### Common Issues

**401 Unauthorized**
- Token expired or invalid
- Check if user is logged in
- Verify token in localStorage

**400 Bad Request**
- Invalid data format
- Check required fields
- Verify AUBH location requirement

**404 Not Found**
- Resource doesn't exist
- Check ID parameters
- Verify endpoint URL

---

## 📁 File Structure

```
web/
├── app/                      # Next.js pages
│   ├── (auth)/              # Auth pages (login, signup)
│   ├── dashboard/           # Dashboards (driver, rider)
│   ├── driver/              # Driver pages
│   ├── rider/               # Rider pages
│   └── ...
├── components/              # Reusable components
│   ├── ui/                 # UI components
│   └── ...
├── lib/                    # Libraries and utilities
│   ├── api/                # API service files ⭐
│   ├── contexts/           # React contexts
│   ├── hooks/              # Custom hooks
│   └── types/              # TypeScript types
└── ...

api/
├── src/
│   ├── controllers/        # API controllers
│   ├── services/           # Business logic
│   ├── entities/           # Database entities
│   ├── dto/                # Data transfer objects
│   ├── repositories/       # Data access
│   └── auth/               # Authentication
└── ...
```

---

## 🎨 UI Components

### Button
```tsx
import { Button } from '@/components/ui/Button';

<Button 
  variant="primary" 
  onClick={handleClick}
  disabled={loading}
>
  {loading ? 'Loading...' : 'Submit'}
</Button>
```

### Input
```tsx
import { Input } from '@/components/ui/Input';

<Input
  type="text"
  value={value}
  onChange={(e) => setValue(e.target.value)}
  placeholder="Enter text"
  required
/>
```

---

## 🌐 Environment Variables

### Development (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### Production (.env.production)
```env
NEXT_PUBLIC_API_URL=https://api.aubh-carshare.com
```

---

## 📖 Documentation Files

1. **Backend-Documentation.md** - Complete API reference
2. **Frontend-Backend-Integration.md** - Integration report
3. **API-Integration-Examples.md** - Code examples
4. **Integration-Complete-Summary.md** - Project summary
5. **Deployment-Checklist.md** - Deployment guide
6. **Quick-Reference.md** - This file

---

## 💡 Tips & Best Practices

### Always
✅ Use try-catch for API calls
✅ Show loading states
✅ Display error messages
✅ Validate input before API calls
✅ Use TypeScript types
✅ Handle 401 errors

### Never
❌ Hardcode API URLs
❌ Expose sensitive data
❌ Ignore errors silently
❌ Make API calls without loading states
❌ Forget to clear tokens on logout

---

## 🆘 Help & Support

### Common Questions

**Q: How do I add a new API endpoint?**
A: Create function in appropriate service file in `lib/api/`

**Q: How do I protect a route?**
A: Check `isAuthenticated` from `useAuth()` in page component

**Q: How do I test API calls?**
A: Use Postman or curl with JWT token

**Q: Where are types defined?**
A: Check `lib/types/index.ts`

**Q: How do I handle errors?**
A: Wrap in try-catch, check `error.response?.data?.message`

### Need More Help?
- Check documentation in `/docs`
- Review examples in `API-Integration-Examples.md`
- Ask team on Slack/Discord
- Create issue on GitHub

---

## 🚦 Quick Start Checklist

- [ ] Install dependencies (`pnpm install`)
- [ ] Start backend (`pnpm start:dev` in api/)
- [ ] Start frontend (`pnpm dev` in web/)
- [ ] Check http://localhost:3001
- [ ] Try login/signup
- [ ] Test ride creation
- [ ] Test booking flow
- [ ] Review documentation

---

*Last Updated: December 14, 2025*
*For AUBH CarShare Development Team*
