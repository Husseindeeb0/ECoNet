import { Document, Types } from "mongoose";

export interface IBooking extends Document {
  user: Types.ObjectId;
  event: Types.ObjectId;
  seats: number;
  totalPrice?: number;
  status: "confirmed" | "cancelled" | "attended" | "pending" | "rejected";
  bookingDate: Date;
  name: string;
  email: string;
  phone: string;
}

export interface BookingDetails {
  _id: string;
  user: string;
  event: string;
  eventId?: string; // Some APIs use eventId directly
  title?: string;
  location?: string;
  startsAt?: string;
  endsAt?: string;
  coverImageUrl?: string;
  capacity?: number;
  description?: string;
  seats: number;
  numberOfSeats?: number; // Alias for seats
  totalPrice?: number;
  status: "confirmed" | "cancelled" | "attended" | "pending" | "rejected";
  bookingDate: string;
  bookedAt?: string; // Alias for bookingDate
  name: string;
  email: string;
  phone: string;
  userId?: string;
  organizer?: {
    _id: string;
    name: string;
    email: string;
    imageUrl?: string;
  } | null;
  averageRating?: number;
  ratingCount?: number;
  userRating?: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface BookingResponse {
  userId: string;
  userName: string;
  userEmail: string;
  seatsBooked: number;
  bookedAt: string;
}
