import { apiClient } from '../api';
import { Rider } from '../types';

export interface RegisterRiderPayload {
  preferredPickupLocation?: string;
}

export interface UpdateRiderPayload {
  preferredPickupLocation?: string;
}

export const ridersApi = {
  // Register as rider
  async registerRider(data: RegisterRiderPayload = {}): Promise<Rider> {
    const response = await apiClient.post('/riders', data);
    return response.data;
  },

  // Get all riders
  async getAllRiders(): Promise<Rider[]> {
    const response = await apiClient.get('/riders');
    return response.data;
  },

  // Get rider by user ID
  async getRiderByUserId(userId: number): Promise<Rider> {
    const response = await apiClient.get(`/riders/user/${userId}`);
    return response.data;
  },

  // Update rider profile
  async updateRider(userId: number, data: UpdateRiderPayload): Promise<Rider> {
    const response = await apiClient.put(`/riders/user/${userId}`, data);
    return response.data;
  },

  // Update pickup location
  async updatePickupLocation(userId: number, lat: number, lng: number, address: string): Promise<Rider> {
    const response = await apiClient.put(`/riders/user/${userId}/pickup-location`, {
      lat,
      lng,
      address,
    });
    return response.data;
  },
};
