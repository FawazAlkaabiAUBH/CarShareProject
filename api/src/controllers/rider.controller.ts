import {
  Controller,
  Post,
  Put,
  Body,
  Param,
  ParseIntPipe,
  Get,
} from '@nestjs/common';
import { RiderService } from '../services/rider.service';
import { RegisterRiderDto, UpdateRiderDto } from '../dto/rider.dto';

@Controller('riders')
export class RiderController {
  constructor(private readonly riderService: RiderService) {}

  @Post()
  registerRider(@Body() registerRiderDto: RegisterRiderDto) {
    return this.riderService.registerRider(registerRiderDto);
  }

  @Get('user/:userId')
  getRiderByUserId(@Param('userId', ParseIntPipe) userId: number) {
    return this.riderService.getRiderByUserId(userId);
  }

  @Get()
  getAllRiders() {
    return this.riderService.getAllRiders();
  }

  @Put('user/:userId')
  updateRider(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() updateRiderDto: UpdateRiderDto,
  ) {
    return this.riderService.updateRider(userId, updateRiderDto);
  }

  @Put('user/:userId/pickup-location')
  updatePickupLocation(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() locationDto: { location: string },
  ) {
    this.riderService.updatePickupLocation(userId, locationDto.location);
    return { message: 'Pickup location updated successfully' };
  }
}
