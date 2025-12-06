import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Controllers
import { UserController } from './controllers/user.controller';
import { RideController } from './controllers/ride.controller';
import { BookingController } from './controllers/booking.controller';
import { RatingController } from './controllers/rating.controller';
import { DriverController } from './controllers/driver.controller';
import { RiderController } from './controllers/rider.controller';

// Services
import { UserService } from './services/user.service';
import { RideService } from './services/ride.service';
import { BookingService } from './services/booking.service';
import { RatingService } from './services/rating.service';
import { DriverService } from './services/driver.service';
import { RiderService } from './services/rider.service';

// Repositories
import { UserRepository } from './repositories/user.repository';
import { RideRepository } from './repositories/ride.repository';
import { BookingRepository } from './repositories/booking.repository';
import { RatingRepository } from './repositories/rating.repository';
import { DriverRepository } from './repositories/driver.repository';
import { RiderRepository } from './repositories/rider.repository';

@Module({
  imports: [],
  controllers: [
    AppController,
    UserController,
    RideController,
    BookingController,
    RatingController,
    DriverController,
    RiderController,
  ],
  providers: [
    AppService,
    // Services
    UserService,
    RideService,
    BookingService,
    RatingService,
    DriverService,
    RiderService,
    // Repositories
    UserRepository,
    RideRepository,
    BookingRepository,
    RatingRepository,
    DriverRepository,
    RiderRepository,
  ],
})
export class AppModule {}
