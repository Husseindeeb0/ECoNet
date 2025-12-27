import { Document } from "mongoose";

export interface ISpeaker {
  name: string;
  title?: string;
  bio?: string;
  linkedinLink?: string;
  instagramLink?: string;
  twitterLink?: string;
  profileImageUrl?: string;
  profileImageFileId?: string;
}

export interface IScheduleItem {
  title: string;
  startTime: string;
  endTime?: string;
  date?: Date;
  presenter?: string;
  description?: string;
  type?: "session" | "break" | "opening" | "closing";
}

export interface IEvent extends Document {
  organizerId: string;
  title: string;
  location?: string;
  isOnline: boolean;
  meetingLink?: string;
  startsAt?: Date;
  endsAt?: Date;
  coverImageUrl?: string;
  coverImageFileId?: string;
  capacity?: number;
  availableSeats?: number;
  category?: string;
  description?: string;
  speakers?: ISpeaker[];
  schedule?: IScheduleItem[];
  averageRating?: number;
  ratingCount?: number;
  isPaid: boolean;
  price?: number;
  whishNumber?: string;
  liveStreamUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface EventDisplay {
  _id: string;
  id?: string; // For compatibility with different API responses
  organizerId: string;
  title: string;
  location?: string;
  isOnline: boolean;
  meetingLink?: string;
  startsAt: string;
  endsAt?: string;
  coverImageUrl?: string;
  coverImageFileId?: string;
  capacity?: number;
  availableSeats?: number;
  bookedCount?: number;
  category: string;
  description?: string;
  speakers?: ISpeaker[];
  schedule?: IScheduleItem[];
  averageRating?: number;
  ratingCount?: number;
  isPaid: boolean;
  price?: number;
  whishNumber?: string;
  liveStreamUrl?: string;
  organizer?: {
    _id: string;
    name: string;
    email: string;
    imageUrl?: string;
  };
  createdAt: string;
  updatedAt: string;
}
