import Database from 'better-sqlite3';
import { join } from 'path';
import { Notification } from '../entities/notification.entity';

export class NotificationRepository {
  private db: Database.Database;

  constructor() {
    const dbPath = join(__dirname, '../../data.db');
    this.db = new Database(dbPath);
  }

  /**
   * Create a new notification
   */
  save(notification: Partial<Notification>): Notification {
    const stmt = this.db.prepare(`
      INSERT INTO notifications (
        userId, type, title, body, 
        relatedRideId, relatedUserId, 
        isRead, createdAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      notification.userId,
      notification.type,
      notification.title,
      notification.body,
      notification.relatedRideId || null,
      notification.relatedUserId || null,
      notification.isRead ? 1 : 0,
      notification.createdAt?.toISOString() || new Date().toISOString()
    );

    return this.findById(result.lastInsertRowid as number)!;
  }

  /**
   * Find notification by ID
   */
  findById(id: number): Notification | undefined {
    const stmt = this.db.prepare(`
      SELECT * FROM notifications WHERE notificationId = ?
    `);
    const row = stmt.get(id);
    return row ? this.mapToEntity(row) : undefined;
  }

  /**
   * Find all notifications for a user
   */
  findByUserId(userId: number, limit: number = 50): Notification[] {
    const stmt = this.db.prepare(`
      SELECT * FROM notifications 
      WHERE userId = ? 
      ORDER BY createdAt DESC 
      LIMIT ?
    `);
    const rows = stmt.all(userId, limit);
    return rows.map((row) => this.mapToEntity(row));
  }

  /**
   * Find unread notifications for a user
   */
  findUnreadByUserId(userId: number): Notification[] {
    const stmt = this.db.prepare(`
      SELECT * FROM notifications 
      WHERE userId = ? AND isRead = 0 
      ORDER BY createdAt DESC
    `);
    const rows = stmt.all(userId);
    return rows.map((row) => this.mapToEntity(row));
  }

  /**
   * Count unread notifications for a user
   */
  countUnreadByUserId(userId: number): number {
    const stmt = this.db.prepare(`
      SELECT COUNT(*) as count 
      FROM notifications 
      WHERE userId = ? AND isRead = 0
    `);
    const result = stmt.get(userId) as { count: number };
    return result.count;
  }

  /**
   * Mark notification as read
   */
  markAsRead(notificationId: number): void {
    const stmt = this.db.prepare(`
      UPDATE notifications 
      SET isRead = 1 
      WHERE notificationId = ?
    `);
    stmt.run(notificationId);
  }

  /**
   * Mark all notifications as read for a user
   */
  markAllAsReadForUser(userId: number): void {
    const stmt = this.db.prepare(`
      UPDATE notifications 
      SET isRead = 1 
      WHERE userId = ? AND isRead = 0
    `);
    stmt.run(userId);
  }

  /**
   * Delete old read notifications (cleanup)
   */
  deleteOldReadNotifications(daysOld: number = 30): number {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const stmt = this.db.prepare(`
      DELETE FROM notifications 
      WHERE isRead = 1 AND createdAt < ?
    `);
    const result = stmt.run(cutoffDate.toISOString());
    return result.changes;
  }

  /**
   * Map database row to Notification entity
   */
  private mapToEntity(row: any): Notification {
    return new Notification({
      notificationId: row.notificationId,
      userId: row.userId,
      type: row.type,
      title: row.title,
      body: row.body,
      relatedRideId: row.relatedRideId,
      relatedUserId: row.relatedUserId,
      isRead: row.isRead === 1,
      createdAt: new Date(row.createdAt),
    });
  }
}
