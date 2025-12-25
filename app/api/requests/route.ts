import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/middleware/authMiddleware";
import connectDb from "@/lib/connectDb";
import Booking from "@/models/Booking";
import Event from "@/models/Event";
import User from "@/models/User";

export async function GET(req: NextRequest) {
  try {
    const authResult = await authMiddleware(req);
    if (authResult.error) return authResult.response;

    const { userId, role } = authResult.user!;
    if (role !== "organizer") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const eventId = searchParams.get("eventId");

    await connectDb();

    const query: any = { status: "pending" };
    if (eventId) {
      query.event = eventId;
      // Verify organizer owns this event
      const event = await Event.findById(eventId);
      if (!event || event.organizerId !== userId) {
        return NextResponse.json(
          { success: false, message: "Unauthorized" },
          { status: 403 }
        );
      }
    } else {
      // Find events owned by this organizer
      const events = await Event.find({ organizerId: userId }).select("_id");
      const eventIds = events.map((e) => e._id);
      query.event = { $in: eventIds };
    }

    const requests = await Booking.find(query)
      .populate("event", "title")
      .populate("user", "name email imageUrl")
      .sort({ createdAt: -1 })
      .lean();

    const formattedRequests = requests.map((req: any) => ({
      ...req,
      _id: req._id.toString(),
      eventId: req.event?._id?.toString(),
      eventTitle: req.event?.title,
      userName: req.user?.name || req.name,
      userEmail: req.user?.email || req.email,
      userImage: req.user?.imageUrl,
      bookedAt: req.createdAt.toISOString(),
    }));

    return NextResponse.json({ success: true, requests: formattedRequests });
  } catch (error) {
    console.error("Error fetching requests:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
