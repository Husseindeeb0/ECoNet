import mongoose, { Schema, model, models } from "mongoose";
import { IReview } from "@/types/rating";

const ReviewSchema = new Schema<IReview>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    event: { type: Schema.Types.ObjectId, ref: "Event", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
  },
  { timestamps: true }
);

ReviewSchema.index({ user: 1, event: 1 }, { unique: true });

if (models.Review) {
  delete models.Review;
}

const Review = model<IReview>("Review", ReviewSchema);

export default Review;
