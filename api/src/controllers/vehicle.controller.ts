import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { VehicleService } from '../services/vehicle.service';
import { CreateVehicleDto, UpdateVehicleDto } from '../dto/vehicle.dto';

@Controller('vehicles')
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @Get('my')
  async getMyVehicles(@Request() req: any) {
    return this.vehicleService.getVehiclesByUserId(req.user.userId);
  }

  @Get('my/active')
  async getMyActiveVehicles(@Request() req: any) {
    return this.vehicleService.getActiveVehiclesByUserId(req.user.userId);
  }

  @Get(':id')
  async getVehicleById(@Param('id', ParseIntPipe) id: number) {
    return this.vehicleService.getVehicleById(id);
  }

  @Post()
  async createVehicle(@Request() req: any, @Body() dto: CreateVehicleDto) {
    return this.vehicleService.createVehicle(req.user.userId, dto);
  }

  @Put(':id')
  async updateVehicle(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: any,
    @Body() dto: UpdateVehicleDto,
  ) {
    return this.vehicleService.updateVehicle(id, req.user.userId, dto);
  }

  @Put(':id/deactivate')
  async deactivateVehicle(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: any,
  ) {
    await this.vehicleService.deactivateVehicle(id, req.user.userId);
    return { message: 'Vehicle deactivated successfully' };
  }

  @Delete(':id')
  async deleteVehicle(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: any,
  ) {
    await this.vehicleService.deleteVehicle(id, req.user.userId);
    return { message: 'Vehicle deleted successfully' };
  }
}
