import mongoose, { Schema, model, models } from "mongoose";
import { IEvent } from "@/types/event";

const EventSchema = new Schema<IEvent>(
  {
    organizerId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
    meetingLink: {
      type: String,
    },
    liveStreamUrl: {
      type: String,
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    ratingCount: {
      type: Number,
      default: 0,
    },
    location: {
      type: String,
    },
    startsAt: {
      type: Date,
    },
    endsAt: {
      type: Date,
    },
    coverImageUrl: {
      type: String,
    },
    coverImageFileId: {
      type: String,
    },
    capacity: {
      type: Number,
    },
    availableSeats: {
      type: Number,
    },
    category: {
      type: String,
      default: "Other",
    },
    description: {
      type: String,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    price: {
      type: Number,
      default: 0,
    },
    whishNumber: {
      type: String,
    },
    speakers: [
      {
        name: { type: String, required: true },
        title: String,
        bio: String,
        linkedinLink: String,
        instagramLink: String,
        twitterLink: String,
        profileImageUrl: String,
        profileImageFileId: String,
      },
    ],
    schedule: [
      {
        title: { type: String, required: true },
        startTime: { type: String, required: true },
        endTime: String,
        date: Date,
        presenter: String,
        description: String,
        type: {
          type: String,
          enum: ["session", "break", "opening", "closing"],
          default: "session",
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

if (models.Event) {
  delete models.Event;
}

const Event = model<IEvent>("Event", EventSchema);

export default Event;
