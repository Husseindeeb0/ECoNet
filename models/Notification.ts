import mongoose, { Schema } from "mongoose";
import { INotification } from "@/types/notification";

const NotificationSchema = new Schema<INotification>(
  {
    recipient: { type: Schema.Types.ObjectId, ref: "User", required: true },
    sender: { type: Schema.Types.ObjectId, ref: "User" },
    type: { type: String, required: true },
    message: { type: String, required: true },
    relatedEntityId: { type: Schema.Types.ObjectId },
    relatedEntityType: { type: String, enum: ["Event", "User"] },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

NotificationSchema.index({ recipient: 1 });
NotificationSchema.index({ createdAt: -1 });

const Notification =
  mongoose.models.Notification ||
  mongoose.model<INotification>("Notification", NotificationSchema);
export default Notification;
