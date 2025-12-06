import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './auth/public.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get()
  getApiInfo() {
    return {
      name: 'AUBH CarShare API',
      version: '1.0.0',
      description: 'University Carpooling & Ride Sharing App Backend',
      endpoints: {
        auth: '/auth',
        users: '/users',
        rides: '/rides',
        bookings: '/bookings',
        ratings: '/ratings',
        drivers: '/drivers',
        riders: '/riders',
      },
      features: [
        'JWT Authentication',
        'Ride Posting',
        'Seat Booking',
        'Driver-Rider Matching',
        'Rating System',
      ],
    };
  }

  @Public()
  @Get('health')
  healthCheck() {
    return {
      status: 'OK',
      timestamp: new Date().toISOString(),
    };
  }
}

