export class CreateRatingDto {
  rideId: number;
  riderId: number;
  driverId: number;
  score: number; // 1-5
  comment: string;
  feedbackTags?: string[];
}

export class UpdateRatingDto {
  score?: number;
  comment?: string;
  feedbackTags?: string[];
}
