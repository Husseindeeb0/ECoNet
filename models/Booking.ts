import mongoose, { Schema, Model } from "mongoose";
import { IBooking } from "@/types/booking";

const BookingSchema = new Schema<IBooking>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    event: { type: Schema.Types.ObjectId, ref: "Event", required: true },
    seats: { type: Number, required: true, min: 1 },
    totalPrice: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["confirmed", "cancelled", "attended", "pending", "rejected"],
      default: "confirmed",
    },
    bookingDate: { type: Date, default: Date.now },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
  },
  { timestamps: true }
);

BookingSchema.index({ user: 1, event: 1 });
BookingSchema.index({ event: 1 });
BookingSchema.index({ status: 1 });

const Booking: Model<IBooking> =
  mongoose.models.Booking || mongoose.model<IBooking>("Booking", BookingSchema);

export default Booking;
