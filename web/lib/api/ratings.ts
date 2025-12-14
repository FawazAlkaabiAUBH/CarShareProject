import { apiClient } from '../api';
import { Rating } from '../types';

export interface CreateRatingPayload {
  rideId: number;
  rateeId: number;
  score: number; // 1-5
  comment?: string;
  feedbackTags?: string;
}

export const ratingsApi = {
  // Create a new rating
  async createRating(data: CreateRatingPayload): Promise<Rating> {
    const response = await apiClient.post('/ratings', data);
    return response.data;
  },

  // Get rating by ID
  async getRatingById(ratingId: number): Promise<Rating> {
    const response = await apiClient.get(`/ratings/${ratingId}`);
    return response.data;
  },

  // Get user's average rating
  async getUserAverageRating(userId: number): Promise<{ averageRating: number; totalRatings: number }> {
    const response = await apiClient.get(`/ratings/user/${userId}/average`);
    return response.data;
  },

  // Get ratings given by user
  async getRatingsGivenByUser(userId: number): Promise<Rating[]> {
    const response = await apiClient.get(`/ratings/user/${userId}/given`);
    return response.data;
  },

  // Get ratings received by user
  async getRatingsReceivedByUser(userId: number): Promise<Rating[]> {
    const response = await apiClient.get(`/ratings/user/${userId}/received`);
    return response.data;
  },

  // Get ratings for a ride
  async getRatingsForRide(rideId: number): Promise<Rating[]> {
    const response = await apiClient.get(`/ratings/ride/${rideId}`);
    return response.data;
  },

  // Update rating
  async updateRating(ratingId: number, data: Partial<CreateRatingPayload>): Promise<Rating> {
    const response = await apiClient.put(`/ratings/${ratingId}`, data);
    return response.data;
  },

  // Delete rating
  async deleteRating(ratingId: number): Promise<void> {
    await apiClient.delete(`/ratings/${ratingId}`);
  },
};
