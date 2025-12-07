import {
  Controller,
  Post,
  Put,
  Body,
  Param,
  ParseIntPipe,
  Get,
} from '@nestjs/common';
import { DriverService } from '../services/driver.service';
import { RegisterDriverDto, UpdateDriverDto } from '../dto/driver.dto';

@Controller('drivers')
export class DriverController {
  constructor(private readonly driverService: DriverService) {}

  @Post()
  registerDriver(@Body() registerDriverDto: RegisterDriverDto) {
    return this.driverService.registerDriver(registerDriverDto);
  }

  @Get('verified')
  getVerifiedDrivers() {
    return this.driverService.getVerifiedDrivers();
  }

  @Get('pending')
  getPendingDrivers() {
    return this.driverService.getPendingDrivers();
  }

  @Get('user/:userId')
  getDriverByUserId(@Param('userId', ParseIntPipe) userId: number) {
    return this.driverService.getDriverByUserId(userId);
  }

  @Get('user/:userId/status')
  async getDriverStatus(@Param('userId', ParseIntPipe) userId: number) {
    try {
      const driver = await this.driverService.getDriverByUserId(userId);
      return {
        isDriver: !!driver,
        isVerified: driver?.isVerified || false,
        driver: driver || null,
      };
    } catch {
      return {
        isDriver: false,
        isVerified: false,
        driver: null,
      };
    }
  }

  @Get()
  getAllDrivers() {
    return this.driverService.getAllDrivers();
  }

  @Put('user/:userId')
  updateDriver(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() updateDriverDto: UpdateDriverDto,
  ) {
    return this.driverService.updateDriver(userId, updateDriverDto);
  }

  @Put(':id/rating')
  updateRating(
    @Param('id', ParseIntPipe) id: number,
    @Body() ratingDto: { rating: number },
  ) {
    this.driverService.updateRating(id, ratingDto.rating);
    return { message: 'Driver rating updated successfully' };
  }
}
