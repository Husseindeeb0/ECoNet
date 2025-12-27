import { Document, Types } from "mongoose";

export interface IComment extends Document {
  content: string;
  event: Types.ObjectId;
  user: Types.ObjectId;
  likes: Types.ObjectId[];
  isPinned: boolean;
  replyTo?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface CommentDisplay {
  _id: string;
  content: string;
  user: {
    _id: string;
    name: string;
    imageUrl?: string;
  };
  likes: string[];
  isPinned: boolean;
  replyTo?: {
    _id: string;
    user: { name: string };
    content: string;
  };
  createdAt: string;
  updatedAt: string;
}
