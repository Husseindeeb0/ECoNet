import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/connectDb";
import User from "@/models/User";
import Event from "@/models/Event";
import { cookies } from "next/headers";
import { verifyToken, TokenPayload } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    // Get token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized - No token provided" },
        { status: 401 }
      );
    }

    // Verify token using auth library
    const decoded = verifyToken(token, "access") as TokenPayload | null;

    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized - Invalid token" },
        { status: 401 }
      );
    }

    await connectDb();

    // Find user and populate booked events
    const user = await User.findById(decoded.userId)
      .select("bookedEvents")
      .lean();

    if (!user) {
      console.log("User not found for ID:", decoded.userId);
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const bookedEvents = user.bookedEvents || [];
    console.log(
      `Found ${bookedEvents.length} bookings for user ${decoded.userId}`
    );

    // Get all event IDs from booked events
    const eventIds = bookedEvents.map((booking: any) => booking.eventId);

    // Fetch all events
    const events = await Event.find({ _id: { $in: eventIds } }).lean();
    console.log(`Found ${events.length} events matching bookings`);

    // Create a map of events by ID for quick lookup
    const eventMap = new Map();
    events.forEach((event: any) => {
      eventMap.set(event._id.toString(), event);
    });

    // Combine booking info with event details
    const bookingsWithDetails = bookedEvents
      .map((booking: any) => {
        if (!booking.eventId) return null;
        const event = eventMap.get(booking.eventId.toString());
        if (!event) return null;

        return {
          _id: booking._id,
          eventId: event._id,
          title: event.title,
          location: event.location,
          startsAt: event.startsAt,
          coverImageUrl: event.coverImageUrl,
          capacity: event.capacity,
          description: event.description,
          numberOfSeats: booking.numberOfSeats,
          bookedAt: booking.bookedAt,
        };
      })
      .filter(Boolean); // Remove null entries

    return NextResponse.json({
      success: true,
      bookings: bookingsWithDetails,
    });
  } catch (error: any) {
    console.error("Error fetching bookings:", error);
    // Log stack trace if available
    if (error.stack) console.error(error.stack);

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error: " + (error.message || "Unknown error"),
      },
      { status: 500 }
    );
  }
}
