import { apiClient } from '../api';
import { Driver } from '../types';

export interface RegisterDriverPayload {
  licenseNumber: string;
  licenseDocument?: string;
}

export interface UpdateDriverPayload {
  licenseNumber?: string;
  licenseDocument?: string;
}

export const driversApi = {
  // Register as driver
  async registerDriver(data: RegisterDriverPayload): Promise<Driver> {
    const response = await apiClient.post('/drivers', data);
    return response.data;
  },

  // Get all drivers
  async getAllDrivers(): Promise<Driver[]> {
    const response = await apiClient.get('/drivers');
    return response.data;
  },

  // Get verified drivers
  async getVerifiedDrivers(): Promise<Driver[]> {
    const response = await apiClient.get('/drivers/verified');
    return response.data;
  },

  // Get driver by user ID
  async getDriverByUserId(userId: number): Promise<Driver> {
    const response = await apiClient.get(`/drivers/user/${userId}`);
    return response.data;
  },

  // Get driver status
  async getDriverStatus(userId: number): Promise<{ isDriver: boolean; isVerified: boolean }> {
    const response = await apiClient.get(`/drivers/user/${userId}/status`);
    return response.data;
  },

  // Update driver profile
  async updateDriver(userId: number, data: UpdateDriverPayload): Promise<Driver> {
    const response = await apiClient.put(`/drivers/user/${userId}`, data);
    return response.data;
  },

  // Delete driver profile
  async deleteDriver(userId: number): Promise<void> {
    await apiClient.delete(`/drivers/user/${userId}`);
  },
};
