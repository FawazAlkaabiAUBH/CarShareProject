import { apiClient } from '../api';
import { Booking } from '../types';

export interface CreateBookingPayload {
  rideId: number;
  seatsBooked?: number;
  paymentMethod: 'CASH' | 'BENEFITPAY';
  benefitPayPhone?: string;
}

export interface UpdateBookingStatusPayload {
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  cancellationReason?: string;
}

export const bookingsApi = {
  // Create a new booking
  async createBooking(data: CreateBookingPayload): Promise<Booking> {
    const response = await apiClient.post('/bookings', data);
    return response.data;
  },

  // Get booking by ID
  async getBookingById(bookingId: number): Promise<Booking> {
    const response = await apiClient.get(`/bookings/${bookingId}`);
    return response.data;
  },

  // Get my bookings
  async getMyBookings(): Promise<Booking[]> {
    const response = await apiClient.get('/bookings/my');
    return response.data;
  },

  // Get bookings for a specific ride
  async getBookingsForRide(rideId: number): Promise<Booking[]> {
    const response = await apiClient.get(`/bookings/ride/${rideId}`);
    return response.data;
  },

  // Get bookings for a specific user
  async getBookingsByUser(userId: number): Promise<Booking[]> {
    const response = await apiClient.get(`/bookings/user/${userId}`);
    return response.data;
  },

  // Update booking status
  async updateBookingStatus(bookingId: number, data: UpdateBookingStatusPayload): Promise<Booking> {
    const response = await apiClient.put(`/bookings/${bookingId}/status`, data);
    return response.data;
  },

  // Cancel booking
  async cancelBooking(bookingId: number, cancellationReason?: string): Promise<void> {
    await apiClient.post(`/bookings/${bookingId}/cancel`, { cancellationReason });
  },
};
