import mongoose, { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    // Add other fields as needed, e.g., userId, status, etc.
  },
  {
    timestamps: true,
  }
);

const User = models.User || model("User", UserSchema);

export default User;
