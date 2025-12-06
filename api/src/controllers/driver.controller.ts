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

  @Get('available')
  getAvailableDrivers() {
    return this.driverService.getAvailableDrivers();
  }

  @Get('user/:userId')
  getDriverByUserId(@Param('userId', ParseIntPipe) userId: number) {
    return this.driverService.getDriverByUserId(userId);
  }

  @Get(':id')
  getDriver(@Param('id', ParseIntPipe) id: number) {
    return this.driverService.getDriverById(id);
  }

  @Get()
  getAllDrivers() {
    return this.driverService.getAllDrivers();
  }

  @Put(':id')
  updateDriver(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDriverDto: UpdateDriverDto,
  ) {
    return this.driverService.updateDriver(id, updateDriverDto);
  }

  @Put(':id/availability')
  updateAvailability(
    @Param('id', ParseIntPipe) id: number,
    @Body() statusDto: { status: 'AVAILABLE' | 'BUSY' | 'OFFLINE' },
  ) {
    this.driverService.updateAvailabilityStatus(id, statusDto.status);
    return { message: 'Availability updated successfully' };
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
