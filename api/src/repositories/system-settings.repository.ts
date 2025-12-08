import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { SystemSettings, FareSettings } from '../entities/system-settings.entity';

@Injectable()
export class SystemSettingsRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  /**
   * Get a setting by key
   */
  findByKey(key: string): SystemSettings | undefined {
    const db = this.databaseService.getDatabase();
    const row = db
      .prepare('SELECT * FROM system_settings WHERE settingKey = ?')
      .get(key) as any;

    if (!row) return undefined;

    return {
      settingKey: row.settingKey,
      settingValue: row.settingValue,
      description: row.description,
      updatedAt: new Date(row.updatedAt),
    };
  }

  /**
   * Get all settings
   */
  findAll(): SystemSettings[] {
    const db = this.databaseService.getDatabase();
    const rows = db.prepare('SELECT * FROM system_settings').all() as any[];

    return rows.map((row) => ({
      settingKey: row.settingKey,
      settingValue: row.settingValue,
      description: row.description,
      updatedAt: new Date(row.updatedAt),
    }));
  }

  /**
   * Get fare-related settings
   */
  getFareSettings(): FareSettings {
    const baseFare = this.findByKey('BASE_FARE');
    const farePerKm = this.findByKey('FARE_PER_KM');
    const serviceFeePercentage = this.findByKey('SERVICE_FEE_PERCENTAGE');
    const minFare = this.findByKey('MIN_FARE');
    const currencyCode = this.findByKey('CURRENCY_CODE');

    return {
      baseFare: baseFare ? parseFloat(baseFare.settingValue) : 0.5,
      farePerKm: farePerKm ? parseFloat(farePerKm.settingValue) : 0.15,
      serviceFeePercentage: serviceFeePercentage
        ? parseFloat(serviceFeePercentage.settingValue)
        : 10,
      minFare: minFare ? parseFloat(minFare.settingValue) : 1.0,
      currencyCode: currencyCode ? currencyCode.settingValue : 'BHD',
    };
  }

  /**
   * Update a setting
   */
  update(key: string, value: string): void {
    const db = this.databaseService.getDatabase();
    const now = new Date().toISOString();

    db.prepare(
      `UPDATE system_settings 
       SET settingValue = ?, updatedAt = ? 
       WHERE settingKey = ?`
    ).run(value, now, key);
  }

  /**
   * Create or update a setting
   */
  upsert(key: string, value: string, description?: string): void {
    const db = this.databaseService.getDatabase();
    const now = new Date().toISOString();

    const existing = this.findByKey(key);
    
    if (existing) {
      this.update(key, value);
    } else {
      db.prepare(
        `INSERT INTO system_settings (settingKey, settingValue, description, updatedAt)
         VALUES (?, ?, ?, ?)`
      ).run(key, value, description || null, now);
    }
  }
}
