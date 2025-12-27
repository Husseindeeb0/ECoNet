import { Document, Types } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  googleId?: string;
  imageUrl?: string;
  imageFileId?: string;
  coverImageUrl?: string;
  coverImageFileId?: string;
  role: "user" | "organizer";
  description?: string;
  refreshToken?: string;
  bookedEvents: Types.ObjectId[];
  attendedEvents: Types.ObjectId[];
  createdEvents: Types.ObjectId[];
  following: Types.ObjectId[];
  followers: Types.ObjectId[];
  followersCount?: number;
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  isVerified?: boolean;
  verificationToken?: string;
  verificationTokenExpire?: Date;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  role: "user" | "organizer";
  description?: string;
  imageUrl?: string;
  imageFileId?: string;
  coverImageUrl?: string;
  coverImageFileId?: string;
  bookedEvents: string[];
  attendedEvents: string[];
  createdEvents: string[];
  following: string[];
  followers: string[];
  followersCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileData {
  name?: string;
  email?: string;
  description?: string;
  imageUrl?: string;
  imageFileId?: string;
  coverImageUrl?: string;
  coverImageFileId?: string;
}
