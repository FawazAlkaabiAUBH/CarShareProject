import { apiClient } from '../api';

export interface Vehicle {
  vehicleId: number;
  userId: number;
  make: string;
  model: string;
  year: number;
  color: string;
  licensePlate: string;
  vehicleDocument?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateVehiclePayload {
  make: string;
  model: string;
  year: number;
  color: string;
  licensePlate: string;
  vehicleDocument?: string;
}

export interface UpdateVehiclePayload {
  make?: string;
  model?: string;
  year?: number;
  color?: string;
  licensePlate?: string;
  vehicleDocument?: string;
}

export const vehiclesApi = {
  // Get my vehicles
  async getMyVehicles(): Promise<Vehicle[]> {
    const response = await apiClient.get('/vehicles/my');
    return response.data;
  },

  // Get my active vehicles
  async getMyActiveVehicles(): Promise<Vehicle[]> {
    const response = await apiClient.get('/vehicles/my/active');
    return response.data;
  },

  // Get vehicle by ID
  async getVehicleById(vehicleId: number): Promise<Vehicle> {
    const response = await apiClient.get(`/vehicles/${vehicleId}`);
    return response.data;
  },

  // Register new vehicle
  async createVehicle(data: CreateVehiclePayload): Promise<Vehicle> {
    const response = await apiClient.post('/vehicles', data);
    return response.data;
  },

  // Update vehicle
  async updateVehicle(vehicleId: number, data: UpdateVehiclePayload): Promise<Vehicle> {
    const response = await apiClient.put(`/vehicles/${vehicleId}`, data);
    return response.data;
  },

  // Deactivate vehicle
  async deactivateVehicle(vehicleId: number): Promise<Vehicle> {
    const response = await apiClient.put(`/vehicles/${vehicleId}/deactivate`);
    return response.data;
  },

  // Delete vehicle
  async deleteVehicle(vehicleId: number): Promise<void> {
    await apiClient.delete(`/vehicles/${vehicleId}`);
  },
};
