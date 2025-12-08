import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Auth
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

// Database
import { DatabaseService } from './database/database.service';

// Controllers
import { UserController } from './controllers/user.controller';
import { RideController } from './controllers/ride.controller';
import { BookingController } from './controllers/booking.controller';
import { RatingController } from './controllers/rating.controller';
import { DriverController } from './controllers/driver.controller';
import { RiderController } from './controllers/rider.controller';
import { VehicleController } from './controllers/vehicle.controller';
import { NotificationController } from './controllers/notification.controller';

// Services
import { UserService } from './services/user.service';
import { RideService } from './services/ride.service';
import { BookingService } from './services/booking.service';
import { RatingService } from './services/rating.service';
import { DriverService } from './services/driver.service';
import { RiderService } from './services/rider.service';
import { VehicleService } from './services/vehicle.service';
import { NotificationService } from './services/notification.service';

// Repositories
import { UserRepository } from './repositories/user.repository';
import { RideRepository } from './repositories/ride.repository';
import { BookingRepository } from './repositories/booking.repository';
import { RatingRepository } from './repositories/rating.repository';
import { DriverRepository } from './repositories/driver.repository';
import { RiderRepository } from './repositories/rider.repository';
import { VehicleRepository } from './repositories/vehicle.repository';
import { NotificationRepository } from './repositories/notification.repository';
import { SystemSettingsRepository } from './repositories/system-settings.repository';

@Module({
  imports: [AuthModule],
  controllers: [
    AppController,
    UserController,
    RideController,
    BookingController,
    RatingController,
    DriverController,
    RiderController,
    VehicleController,
    NotificationController,
  ],
  providers: [
    AppService,
    // Global JWT Auth Guard
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    // Database
    DatabaseService,
    // Services
    UserService,
    RideService,
    BookingService,
    RatingService,
    DriverService,
    RiderService,
    VehicleService,
    NotificationService,
    // Repositories
    UserRepository,
    RideRepository,
    BookingRepository,
    RatingRepository,
    DriverRepository,
    RiderRepository,
    VehicleRepository,
    NotificationRepository,
    SystemSettingsRepository,
  ],
})
export class AppModule {}
