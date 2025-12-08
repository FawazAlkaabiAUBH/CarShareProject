export class SystemSetting {
  settingKey: string;
  settingValue: string;
  description?: string;
  updatedAt: Date;

  constructor(partial: Partial<SystemSetting>) {
    Object.assign(this, partial);
  }
}
