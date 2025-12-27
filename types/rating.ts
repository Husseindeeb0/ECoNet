import { Document, Types } from "mongoose";

export interface IReview extends Document {
  user: Types.ObjectId;
  event: Types.ObjectId;
  rating: number;
  createdAt: Date;
}

export interface ReviewDisplay {
  _id: string;
  user: string;
  event: string;
  rating: number;
  createdAt: string;
}

export interface IFeedback extends Document {
  user: Types.ObjectId;
  booking?: Types.ObjectId;
  type: "event" | "general";
  rating: number;
  category?: "ui" | "performance" | "features" | "bugs" | "other";
  comment?: string;
  createdAt: Date;
}

export interface FeedbackDisplay {
  _id: string;
  user: string;
  booking?: string;
  type: "event" | "general";
  rating: number;
  category?: "ui" | "performance" | "features" | "bugs" | "other" | string;
  comment?: string;
  createdAt: string;
}
