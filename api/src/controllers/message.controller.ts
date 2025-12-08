import { Controller, Post, Get, Patch, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { MessageService } from '../services/message.service';
import { CreateMessageDto, GetMessagesDto } from '../dto/message.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('messages')
@UseGuards(JwtAuthGuard)
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post()
  async sendMessage(@Request() req, @Body() createMessageDto: CreateMessageDto) {
    const userId = req.user.userId;
    return this.messageService.sendMessage(userId, createMessageDto);
  }

  @Get('ride/:rideId')
  async getMessagesForRide(@Request() req, @Param('rideId') rideId: string) {
    const userId = req.user.userId;
    return this.messageService.getMessagesForRide(Number(rideId), userId);
  }

  @Get('conversations')
  async getUserConversations(@Request() req) {
    const userId = req.user.userId;
    return this.messageService.getUserConversations(userId);
  }

  @Get('unread/count')
  async getUnreadCount(@Request() req) {
    const userId = req.user.userId;
    const count = await this.messageService.getUnreadCount(userId);
    return { unreadCount: count };
  }

  @Patch(':id/read')
  async markAsRead(@Request() req, @Param('id') id: string) {
    const userId = req.user.userId;
    return this.messageService.markAsRead(Number(id), userId);
  }
}
