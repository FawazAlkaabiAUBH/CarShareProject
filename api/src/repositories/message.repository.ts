import { Injectable, OnModuleInit } from '@nestjs/common';
import { Message } from '../entities/message.entity';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class MessageRepository implements OnModuleInit {
  private messages: Map<number, Message> = new Map();
  private nextId = 1;

  constructor(private readonly db: DatabaseService) {}

  onModuleInit() {
    this.loadFromDatabase();
  }

  private loadFromDatabase(): void {
    const database = this.db.getDatabase();
    
    // Create messages table if it doesn't exist
    database.exec(`
      CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        rideId INTEGER NOT NULL,
        fromUserId INTEGER NOT NULL,
        toUserId INTEGER NOT NULL,
        text TEXT NOT NULL,
        isRead INTEGER DEFAULT 0,
        sentAt TEXT NOT NULL,
        FOREIGN KEY (rideId) REFERENCES rides(rideId),
        FOREIGN KEY (fromUserId) REFERENCES users(userId),
        FOREIGN KEY (toUserId) REFERENCES users(userId)
      )
    `);

    // Load existing messages
    const messages = database.prepare('SELECT * FROM messages').all() as any[];
    messages.forEach((msg) => {
      const message = new Message({
        id: msg.id,
        rideId: msg.rideId,
        fromUserId: msg.fromUserId,
        toUserId: msg.toUserId,
        text: msg.text,
        isRead: Boolean(msg.isRead),
        sentAt: new Date(msg.sentAt),
      });
      this.messages.set(message.id, message);
      if (message.id >= this.nextId) {
        this.nextId = message.id + 1;
      }
    });
  }

  save(messageData: Partial<Message>): Message {
    const database = this.db.getDatabase();
    const now = new Date();

    const message = new Message({
      id: this.nextId++,
      sentAt: now,
      isRead: false,
      ...messageData,
    });

    database.prepare(`
      INSERT INTO messages (id, rideId, fromUserId, toUserId, text, isRead, sentAt)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      message.id,
      message.rideId,
      message.fromUserId,
      message.toUserId,
      message.text,
      message.isRead ? 1 : 0,
      message.sentAt.toISOString()
    );

    this.messages.set(message.id, message);
    return message;
  }

  findByRideId(rideId: number): Message[] {
    return Array.from(this.messages.values())
      .filter((msg) => msg.rideId === rideId)
      .sort((a, b) => a.sentAt.getTime() - b.sentAt.getTime());
  }

  findByUserId(userId: number): Message[] {
    return Array.from(this.messages.values())
      .filter((msg) => msg.fromUserId === userId || msg.toUserId === userId)
      .sort((a, b) => b.sentAt.getTime() - a.sentAt.getTime());
  }

  findById(id: number): Message | undefined {
    return this.messages.get(id);
  }

  markAsRead(id: number): Message | undefined {
    const database = this.db.getDatabase();
    const message = this.messages.get(id);
    
    if (message) {
      message.isRead = true;
      database.prepare('UPDATE messages SET isRead = 1 WHERE id = ?').run(id);
    }
    
    return message;
  }

  markAllAsReadForRide(rideId: number, userId: number): void {
    const database = this.db.getDatabase();
    const messages = this.findByRideId(rideId).filter(msg => msg.toUserId === userId);
    
    messages.forEach(msg => {
      msg.isRead = true;
      this.messages.set(msg.id, msg);
    });

    database.prepare('UPDATE messages SET isRead = 1 WHERE rideId = ? AND toUserId = ?').run(rideId, userId);
  }

  countUnread(userId: number): number {
    return Array.from(this.messages.values())
      .filter((msg) => msg.toUserId === userId && !msg.isRead).length;
  }
}
