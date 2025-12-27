import { Document, Types } from "mongoose";

export type NotificationType =
  | "LOGIN"
  | "RESERVATION"
  | "CANCELLATION"
  | "NEW_FOLLOWER"
  | "NEW_EVENT_FROM_FOLLOWING"
  | "FEEDBACK_SUBMISSION";

export interface INotification extends Document {
  recipient: Types.ObjectId;
  sender?: Types.ObjectId;
  type: NotificationType;
  message: string;
  relatedEntityId?: Types.ObjectId;
  relatedEntityType?: "Event" | "User";
  isRead: boolean;
  createdAt: Date;
}

export interface NotificationDisplay {
  _id: string;
  recipient: string;
  sender?: string;
  type: NotificationType;
  message: string;
  relatedEntityId?: string;
  relatedEntityType?: "Event" | "User";
  isRead: boolean;
  createdAt: string;
}
