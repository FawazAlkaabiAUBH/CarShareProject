export interface SystemSettings {
  settingKey: string;
  settingValue: string;
  description?: string;
  updatedAt: Date;
}

export interface FareSettings {
  baseFare: number;
  farePerKm: number;
  serviceFeePercentage: number;
  minFare: number;
  currencyCode: string;
}
