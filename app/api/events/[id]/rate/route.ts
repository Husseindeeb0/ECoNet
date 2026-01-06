import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/middleware/authMiddleware";
import connectDb from "@/lib/connectDb";
import Event from "@/models/Event";
import Review from "@/models/Review";
import mongoose from "mongoose";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await authMiddleware(req);
    if (authResult.error) return authResult.response;

    const { userId } = authResult.user!;
    const { id: eventId } = await params;
    const { rating } = await req.json();

    if (!eventId || !rating) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const ratingVal = parseInt(rating, 10);
    if (isNaN(ratingVal) || ratingVal < 1 || ratingVal > 5) {
      return NextResponse.json(
        { success: false, message: "Invalid rating" },
        { status: 400 }
      );
    }

    await connectDb();

    const event = await Event.findById(eventId);
    if (!event) {
      return NextResponse.json(
        { success: false, message: "Event not found" },
        { status: 404 }
      );
    }

    const now = new Date();
    const isFinished = event.endsAt
      ? new Date(event.endsAt) < now
      : event.startsAt
      ? new Date(event.startsAt) < now
      : false;

    if (!isFinished) {
      return NextResponse.json(
        { success: false, message: "You can only rate finished events" },
        { status: 400 }
      );
    }

    const existingReview = await Review.findOne({
      user: userId,
      event: eventId,
    });
    if (existingReview) {
      return NextResponse.json(
        { success: false, message: "You have already rated this event" },
        { status: 400 }
      );
    }

    await Review.create({ user: userId, event: eventId, rating: ratingVal });

    const result = await Review.aggregate([
      { $match: { event: new mongoose.Types.ObjectId(eventId) } },
      {
        $group: {
          _id: null,
          avgRating: { $avg: "$rating" },
          count: { $sum: 1 },
        },
      },
    ]);

    await Event.findByIdAndUpdate(eventId, {
      averageRating: result[0]?.avgRating || 0,
      ratingCount: result[0]?.count || 0,
    });

    return NextResponse.json({
      success: true,
      message: "Event rated successfully",
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Server error";
    console.error("POST /api/events/[id]/rate error:", message, err);
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
