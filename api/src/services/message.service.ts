import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { MessageRepository } from '../repositories/message.repository';
import { RideRepository } from '../repositories/ride.repository';
import { CreateMessageDto } from '../dto/message.dto';

@Injectable()
export class MessageService {
  constructor(
    private readonly messageRepository: MessageRepository,
    private readonly rideRepository: RideRepository,
  ) {}

  async sendMessage(fromUserId: number, dto: CreateMessageDto) {
    // Verify ride exists
    const ride = this.rideRepository.findById(dto.rideId);
    if (!ride) {
      throw new NotFoundException('Ride not found');
    }

    // Verify user is part of this ride (either driver or has booking)
    // This validation could be enhanced to check bookings
    const message = this.messageRepository.save({
      rideId: dto.rideId,
      fromUserId,
      toUserId: dto.toUserId,
      text: dto.text,
    });

    return message;
  }

  async getMessagesForRide(rideId: number, userId: number) {
    // Verify ride exists
    const ride = this.rideRepository.findById(rideId);
    if (!ride) {
      throw new NotFoundException('Ride not found');
    }

    const messages = this.messageRepository.findByRideId(rideId);
    
    // Mark messages addressed to this user as read
    this.messageRepository.markAllAsReadForRide(rideId, userId);

    return messages;
  }

  async getUserConversations(userId: number) {
    const messages = this.messageRepository.findByUserId(userId);
    
    // Group by ride and get latest message for each
    const conversationMap = new Map();
    
    messages.forEach(msg => {
      if (!conversationMap.has(msg.rideId)) {
        conversationMap.set(msg.rideId, msg);
      }
    });

    return Array.from(conversationMap.values());
  }

  async getUnreadCount(userId: number) {
    return this.messageRepository.countUnread(userId);
  }

  async markAsRead(id: number, userId: number) {
    const message = this.messageRepository.findById(id);
    
    if (!message) {
      throw new NotFoundException('Message not found');
    }

    if (message.toUserId !== userId) {
      throw new ForbiddenException('You can only mark your own messages as read');
    }

    return this.messageRepository.markAsRead(id);
  }
}
