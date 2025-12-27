import mongoose, { Schema, model, models } from "mongoose";
import { IComment } from "@/types/comment";

const CommentSchema = new Schema<IComment>(
  {
    content: {
      type: String,
      required: true,
      trim: true,
    },
    event: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    isPinned: {
      type: Boolean,
      default: false,
    },
    replyTo: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

CommentSchema.index({ event: 1, createdAt: 1 });

if (models.Comment) {
  delete models.Comment;
}

const Comment = model<IComment>("Comment", CommentSchema);

export default Comment;
