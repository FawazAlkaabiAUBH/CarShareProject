import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getApiInfo() {
    return {
      name: 'AUBH CarShare API',
      version: '1.0.0',
      description: 'University Carpooling & Ride Sharing App Backend',
      endpoints: {
        users: '/users',
        rides: '/rides',
        bookings: '/bookings',
        ratings: '/ratings',
        drivers: '/drivers',
        riders: '/riders',
      },
      features: [
        'Ride Posting',
        'Seat Booking',
        'Driver-Rider Matching',
        'Rating System',
      ],
    };
  }

  @Get('health')
  healthCheck() {
    return {
      status: 'OK',
      timestamp: new Date().toISOString(),
    };
  }
}

