import { Controller, Get, Post, Put, Param, Body, UseGuards, Request, HttpException, HttpStatus } from '@nestjs/common';
import { NotificationService } from '../services/notification.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateNotificationDto } from '../dto/notification.dto';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  /**
   * Get all notifications for the current user
   * GET /notifications
   */
  @Get()
  async getNotifications(@Request() req) {
    const userId = req.user.userId;
    return this.notificationService.getUserNotifications(userId);
  }

  /**
   * Get unread notifications for the current user
   * GET /notifications/unread
   */
  @Get('unread')
  async getUnreadNotifications(@Request() req) {
    const userId = req.user.userId;
    return this.notificationService.getUnreadNotifications(userId);
  }

  /**
   * Get unread count for the current user
   * GET /notifications/unread/count
   */
  @Get('unread/count')
  async getUnreadCount(@Request() req) {
    const userId = req.user.userId;
    const count = await this.notificationService.getUnreadCount(userId);
    return { count };
  }

  /**
   * Mark a notification as read
   * PUT /notifications/:id/read
   */
  @Put(':id/read')
  async markAsRead(@Param('id') id: string, @Request() req) {
    const userId = req.user.userId;
    try {
      await this.notificationService.markAsRead(parseInt(id), userId);
      return { success: true };
    } catch (error) {
      if (error.message === 'Notification not found') {
        throw new HttpException('Notification not found', HttpStatus.NOT_FOUND);
      }
      if (error.message === 'Unauthorized') {
        throw new HttpException('Unauthorized', HttpStatus.FORBIDDEN);
      }
      throw error;
    }
  }

  /**
   * Mark all notifications as read
   * PUT /notifications/read-all
   */
  @Put('read-all')
  async markAllAsRead(@Request() req) {
    const userId = req.user.userId;
    await this.notificationService.markAllAsRead(userId);
    return { success: true };
  }

  /**
   * Create a notification (admin/system only)
   * POST /notifications
   */
  @Post()
  async createNotification(@Body() createNotificationDto: CreateNotificationDto) {
    // In production, add admin guard here
    return this.notificationService.createNotification(createNotificationDto);
  }
}
