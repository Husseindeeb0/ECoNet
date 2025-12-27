import mongoose, { Schema, Model } from "mongoose";
import { IUser } from "@/types/user";

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "organizer"], default: "user" },
    description: { type: String, trim: true },
    imageUrl: { type: String, default: "" },
    imageFileId: { type: String, default: "" },
    coverImageUrl: { type: String, default: "" },
    coverImageFileId: { type: String, default: "" },
    refreshToken: { type: String, default: null },
    bookedEvents: [{ type: Schema.Types.ObjectId, ref: "Event" }],
    attendedEvents: [{ type: Schema.Types.ObjectId, ref: "Event" }],
    createdEvents: [{ type: Schema.Types.ObjectId, ref: "Event" }],
    resetPasswordToken: { type: String, default: null },
    resetPasswordExpire: { type: Date, default: null },
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String, default: null },
    verificationTokenExpire: { type: Date, default: null },
    followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });

if (mongoose.models.User) {
  delete mongoose.models.User;
}

const User: Model<IUser> = mongoose.model<IUser>("User", UserSchema);

export default User;
