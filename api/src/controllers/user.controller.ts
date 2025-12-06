import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  ParseIntPipe,
  HttpCode,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { CreateUserDto, UpdateUserDto } from '../dto/user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Get()
  getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Get(':id')
  getUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.getUserInfo(id);
  }

  @Put(':id')
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateUser(id, updateUserDto);
  }

  @Post(':id/deactivate')
  @HttpCode(200)
  deactivateUser(@Param('id', ParseIntPipe) id: number) {
    this.userService.deactivateAccount(id);
    return { message: 'User deactivated successfully' };
  }

  @Post('login')
  @HttpCode(200)
  login(@Body() loginDto: { email: string; password: string }) {
    return this.userService.authenticate(loginDto.email, loginDto.password);
  }
}
