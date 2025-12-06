export class Rating {
  ratingId: number;
  rideId: number;
  raterId: number;
  rateeId: number;
  score: number; // 1-5
  comment: string;
  isFlagged: boolean;
  feedbackTags: string[];
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<Rating>) {
    Object.assign(this, partial);
  }
}
