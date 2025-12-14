# Deployment Checklist

## Pre-Deployment Verification

### ✅ Code Quality
- [ ] All TypeScript errors resolved
- [ ] No console.error in production code (use proper logging)
- [ ] All TODO comments resolved
- [ ] Code follows project conventions
- [ ] No hardcoded credentials or secrets

### ✅ API Integration
- [ ] All API endpoints tested
- [ ] Error handling implemented
- [ ] Loading states added
- [ ] Success feedback provided
- [ ] Token management working
- [ ] 401 redirect to login working

### ✅ Environment Configuration
- [ ] `.env.local` configured for development
- [ ] Production environment variables ready
- [ ] API URL points to correct backend
- [ ] No sensitive data in repository

## Development Environment

### Backend Setup
```bash
# Navigate to API directory
cd api

# Install dependencies
pnpm install

# Start development server
pnpm start:dev
```

**Verify**: Backend running on http://localhost:3000

### Frontend Setup
```bash
# Navigate to web directory
cd web

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

**Verify**: Frontend running on http://localhost:3001

## Testing Checklist

### Authentication Flow
- [ ] User can sign up successfully
- [ ] Email validation works
- [ ] Password validation works (min 6 chars)
- [ ] AUBH ID validation works
- [ ] User can login with email
- [ ] User can login with phone
- [ ] JWT token stored correctly
- [ ] Token automatically added to requests
- [ ] Logout clears token and redirects

### Driver Flow
- [ ] Driver can view dashboard stats
- [ ] Stats show correct data from API
- [ ] Driver can register vehicle
- [ ] Driver can post ride
- [ ] AUBH location requirement enforced
- [ ] Direction toggle works (to-aubh/from-aubh)
- [ ] Geolocation button works
- [ ] Ride created successfully
- [ ] Driver can see pending bookings
- [ ] Driver can accept rider
- [ ] Driver can start ride
- [ ] Driver can complete ride
- [ ] Earnings calculated correctly

### Rider Flow
- [ ] Rider can view dashboard stats
- [ ] Stats show correct data from API
- [ ] Rider can search for rides
- [ ] AUBH location requirement enforced
- [ ] Direction toggle works (from-aubh/to-aubh)
- [ ] Geolocation button works
- [ ] Available drivers shown
- [ ] Rider can view driver details
- [ ] Rider can book ride
- [ ] Payment method selection works
- [ ] BenefitPay phone validation works (8 digits)
- [ ] Booking created successfully
- [ ] Safety code displayed
- [ ] Ride status updates shown
- [ ] Payment process works

### Rating System
- [ ] Rating page accessible after ride
- [ ] Star rating works (1-5)
- [ ] Comment field works
- [ ] Quick tags selectable
- [ ] Rating submitted successfully
- [ ] Rating reflects in user profile
- [ ] Average rating calculated correctly

### Profile & History
- [ ] Profile shows correct user data
- [ ] Stats display correctly
- [ ] Rating displayed
- [ ] Verification status shown
- [ ] Ride history loads
- [ ] History shows correct data
- [ ] Completed/cancelled filter works
- [ ] Total spent/earned calculated

### Notifications
- [ ] Notifications load from API
- [ ] Unread count correct
- [ ] Notification types displayed correctly
- [ ] Icons match notification types
- [ ] Mark all as read works
- [ ] Individual mark as read works

## Build & Deploy

### Frontend Build
```bash
cd web
pnpm run build
```

**Verify**:
- [ ] Build completes without errors
- [ ] No TypeScript errors
- [ ] No linting errors
- [ ] All routes pre-rendered

### Backend Build
```bash
cd api
pnpm run build
```

**Verify**:
- [ ] Build completes without errors
- [ ] No TypeScript errors
- [ ] Database migrations ready

## Production Configuration

### Environment Variables

#### Frontend (.env.production)
```env
NEXT_PUBLIC_API_URL=https://api.aubh-carshare.com
```

#### Backend (.env)
```env
JWT_SECRET=<secure-random-string>
DATABASE_PATH=./data.db
PORT=3000
NODE_ENV=production
```

### Security Checklist
- [ ] JWT secret is strong and unique
- [ ] Database file permissions set correctly
- [ ] CORS configured for production domain
- [ ] HTTPS enabled
- [ ] Rate limiting configured
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention (using parameterized queries)
- [ ] XSS prevention
- [ ] CSRF protection if needed

## Deployment Steps

### 1. Deploy Backend
```bash
# Build
cd api
pnpm run build

# Start production server
pnpm start:prod
```

**Verify**:
- [ ] Backend accessible at production URL
- [ ] Health check endpoint works
- [ ] Database initialized
- [ ] Seed data loaded (if needed)

### 2. Deploy Frontend
```bash
# Build
cd web
pnpm run build

# Start production server (or deploy to Vercel/Netlify)
pnpm start
```

**Verify**:
- [ ] Frontend accessible at production URL
- [ ] API calls reach backend
- [ ] No CORS errors
- [ ] Static assets load correctly

### 3. DNS & SSL
- [ ] Domain pointed to server
- [ ] SSL certificate installed
- [ ] HTTPS working
- [ ] HTTP redirects to HTTPS

## Post-Deployment Testing

### Smoke Tests
- [ ] Homepage loads
- [ ] Can sign up
- [ ] Can login
- [ ] Can create ride
- [ ] Can search rides
- [ ] Can book ride
- [ ] Can submit rating
- [ ] Notifications work

### Performance
- [ ] Page load time < 3s
- [ ] API response time < 500ms
- [ ] Images optimized
- [ ] JavaScript minified
- [ ] CSS minified

### Browser Testing
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Chrome
- [ ] Mobile Safari

### Responsive Design
- [ ] Works on mobile (375px+)
- [ ] Works on tablet (768px+)
- [ ] Works on desktop (1024px+)
- [ ] Works on large desktop (1440px+)

## Monitoring & Logging

### Setup
- [ ] Error tracking configured (Sentry, etc.)
- [ ] Analytics configured (Google Analytics, etc.)
- [ ] Logging infrastructure ready
- [ ] Uptime monitoring configured
- [ ] Performance monitoring configured

### Alerts
- [ ] Error rate alerts
- [ ] Downtime alerts
- [ ] High response time alerts
- [ ] Database alerts

## Backup & Recovery

### Database
- [ ] Automatic backups configured
- [ ] Backup retention policy set
- [ ] Restore procedure documented
- [ ] Backup tested

### Code
- [ ] Git repository backed up
- [ ] Deployment rollback plan ready
- [ ] Previous versions tagged

## Documentation

### User Documentation
- [ ] User guide created
- [ ] FAQ prepared
- [ ] Help center ready
- [ ] Support contact available

### Developer Documentation
- [ ] API documentation complete
- [ ] Setup guide updated
- [ ] Architecture documented
- [ ] Deployment guide available

## Support Plan

### Monitoring
- [ ] 24/7 uptime monitoring
- [ ] Error tracking active
- [ ] Performance metrics tracked

### Response Plan
- [ ] Support email configured
- [ ] Emergency contact list ready
- [ ] Escalation procedure defined
- [ ] SLA defined

## Launch Day

### Pre-Launch (24 hours before)
- [ ] All tests passing
- [ ] Production environment ready
- [ ] Backups verified
- [ ] Support team briefed
- [ ] Rollback plan ready

### Launch
- [ ] Deploy backend
- [ ] Deploy frontend
- [ ] Verify all systems operational
- [ ] Monitor for errors
- [ ] Test critical paths

### Post-Launch (first 24 hours)
- [ ] Monitor error rates
- [ ] Monitor performance
- [ ] Check user feedback
- [ ] Address critical issues immediately
- [ ] Document any issues

## Success Criteria

### Technical
- [ ] Uptime > 99%
- [ ] Error rate < 1%
- [ ] API response time < 500ms
- [ ] Page load time < 3s

### User Experience
- [ ] Users can complete signup
- [ ] Users can create/book rides
- [ ] Users can submit ratings
- [ ] No major usability issues

## Rollback Plan

If critical issues arise:

1. **Immediate Actions**
   - [ ] Notify team
   - [ ] Assess severity
   - [ ] Communicate with users

2. **Rollback Backend**
   ```bash
   # Stop current version
   pm2 stop carshare-api
   
   # Switch to previous version
   cd /path/to/previous/version
   pm2 start ecosystem.config.js
   ```

3. **Rollback Frontend**
   ```bash
   # Revert to previous deployment
   vercel rollback
   # or
   git revert <commit-hash>
   git push origin main
   ```

4. **Verify Rollback**
   - [ ] Services running
   - [ ] Basic functionality works
   - [ ] Users can access app

5. **Post-Mortem**
   - [ ] Document what went wrong
   - [ ] Identify root cause
   - [ ] Create fix plan
   - [ ] Prevent recurrence

## Post-Launch Maintenance

### Daily
- [ ] Check error logs
- [ ] Monitor uptime
- [ ] Review user feedback

### Weekly
- [ ] Review performance metrics
- [ ] Update dependencies
- [ ] Security patches

### Monthly
- [ ] Database optimization
- [ ] Performance analysis
- [ ] User analytics review
- [ ] Feature planning

---

## Contact Information

### Team Contacts
- **Project Manager**: [Name] - [Email]
- **Lead Developer**: [Name] - [Email]
- **DevOps**: [Name] - [Email]
- **Support**: support@aubh-carshare.com

### Emergency Contacts
- **After Hours**: [Phone]
- **Escalation**: [Email/Phone]

---

## Notes

- Keep this checklist updated with lessons learned
- Add new items as needed
- Review checklist before each deployment
- Use issue tracker for any blockers

---

*Last Updated: December 14, 2025*
*Version: 1.0*
