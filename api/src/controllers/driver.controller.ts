import {
  Controller,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  Get,
  Request,
} from '@nestjs/common';
import { DriverService } from '../services/driver.service';
import { RegisterDriverDto, UpdateDriverDto } from '../dto/driver.dto';

@Controller('drivers')
export class DriverController {
  constructor(private readonly driverService: DriverService) {}

  @Post()
  registerDriver(@Body() registerDriverDto: RegisterDriverDto, @Request() req: any) {
    return this.driverService.registerDriver(registerDriverDto, req.user.userId);
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

  @Delete('user/:userId')
  deleteDriver(@Param('userId', ParseIntPipe) userId: number) {
    this.driverService.deleteDriver(userId);
    return { message: 'Driver deleted successfully' };
  }

  @Put('user/:userId/verify')
  verifyDriver(
    @Param('userId', ParseIntPipe) userId: number,
    @Request() req: any,
  ) {
    return this.driverService.verifyDriverAndActivateVehicles(userId, req.user.userId);
  }
}
