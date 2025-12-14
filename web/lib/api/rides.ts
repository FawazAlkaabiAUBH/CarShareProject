import { apiClient } from '../api';
import { Ride } from '../types';

export interface CreateRidePayload {
  vehicleId: number;
  origin: string;
  destination: string;
  originLat: number;
  originLng: number;
  destinationLat: number;
  destinationLng: number;
  departureTime: string;
  totalSeats: number;
  estimatedDuration?: number;
  isRecurring?: boolean;
  recurringSchedule?: string;
}

export interface SearchRidesParams {
  lat: number;
  lng: number;
  destLat?: number;
  destLng?: number;
  maxPickupDistance?: number;
  maxDropoffDistance?: number;
  startDate?: string;
  endDate?: string;
}

export const ridesApi = {
  // Create a new ride listing
  async createRide(data: CreateRidePayload): Promise<Ride> {
    const response = await apiClient.post('/rides', data);
    return response.data;
  },

  // Get all available rides
  async getAvailableRides(startDate?: string, endDate?: string): Promise<Ride[]> {
    const response = await apiClient.get('/rides', {
      params: { startDate, endDate },
    });
    return response.data;
  },

  // Search rides with filters
  async searchRides(params: SearchRidesParams): Promise<Ride[]> {
    const response = await apiClient.get('/rides/nearby/search', { params });
    return response.data;
  },

  // Get rides by driver
  async getRidesByDriver(userId: number): Promise<Ride[]> {
    const response = await apiClient.get(`/rides/driver/${userId}`);
    return response.data;
  },

  // Get single ride
  async getRideById(rideId: number): Promise<Ride> {
    const response = await apiClient.get(`/rides/${rideId}`);
    return response.data;
  },

  // Update ride
  async updateRide(rideId: number, data: Partial<CreateRidePayload>): Promise<Ride> {
    const response = await apiClient.put(`/rides/${rideId}`, data);
    return response.data;
  },

  // Cancel ride
  async cancelRide(rideId: number): Promise<void> {
    await apiClient.put(`/rides/${rideId}/cancel`);
  },

  // Start ride (change status to IN_PROGRESS)
  async startRide(rideId: number): Promise<Ride> {
    const response = await apiClient.put(`/rides/${rideId}/start`);
    return response.data;
  },

  // Complete ride
  async completeRide(rideId: number): Promise<Ride> {
    const response = await apiClient.put(`/rides/${rideId}/complete`);
    return response.data;
  },

  // Check available seats
  async checkSeats(rideId: number): Promise<{ rideId: number; availableSeats: number }> {
    const response = await apiClient.get(`/rides/${rideId}/seats`);
    return response.data;
  },

  // Verify safety code
  async verifySafetyCode(rideId: number, safetyCode: string): Promise<{ verified: boolean }> {
    const response = await apiClient.post(`/rides/${rideId}/verify-safety-code`, { safetyCode });
    return response.data;
  },
};
