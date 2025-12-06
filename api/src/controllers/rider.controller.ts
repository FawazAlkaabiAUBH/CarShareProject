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

  @Get(':id')
  getRider(@Param('id', ParseIntPipe) id: number) {
    return this.riderService.getRiderById(id);
  }

  @Get()
  getAllRiders() {
    return this.riderService.getAllRiders();
  }

  @Put(':id')
  updateRider(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRiderDto: UpdateRiderDto,
  ) {
    return this.riderService.updateRider(id, updateRiderDto);
  }

  @Put(':id/payment-method')
  updatePaymentMethod(
    @Param('id', ParseIntPipe) id: number,
    @Body() methodDto: { method: string },
  ) {
    this.riderService.updatePaymentMethod(id, methodDto.method);
    return { message: 'Payment method updated successfully' };
  }

  @Put(':id/loyalty')
  updateLoyaltyPoints(
    @Param('id', ParseIntPipe) id: number,
    @Body() loyaltyDto: { points: number },
  ) {
    this.riderService.incrementLoyaltyPoints(id, loyaltyDto.points);
    return { message: 'Loyalty points updated successfully' };
  }
}
