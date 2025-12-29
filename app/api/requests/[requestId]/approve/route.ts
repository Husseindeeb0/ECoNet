import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/middleware/authMiddleware";
import connectDb from "@/lib/connectDb";
import Booking from "@/models/Booking";
import Event from "@/models/Event";
import User from "@/models/User";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ requestId: string }> }
) {
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

    const { requestId } = await params;
    await connectDb();

    const booking = await Booking.findById(requestId).populate("event");
    if (!booking) {
      return NextResponse.json(
        { success: false, message: "Request not found" },
        { status: 404 }
      );
    }

    const event = booking.event as any;
    if (event.organizerId !== userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 403 }
      );
    }

    booking.status = "confirmed";
    await booking.save();

    // Update user: add event to bookedEvents
    await User.findByIdAndUpdate(booking.user, {
      $addToSet: { bookedEvents: event._id },
    });

    // Notify user
    try {
      const { createNotification } = await import("@/lib/notifications");
      await createNotification({
        recipient: booking.user.toString(),
        type: "RESERVATION",
        message: `Your booking request for "${event.title}" has been approved!`,
        relatedEntityId: event._id.toString(),
        relatedEntityType: "Event",
      });

      // Send email
      try {
        const { sendEmail } = await import("@/lib/sendEmail");
        const user = await User.findById(booking.user).select("email name");
        if (user) {
          await sendEmail({
            to: user.email,
            subject: `✅ Booking Approved: ${event.title}`,
            html: `
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
                <h2 style="color: #4f46e5;">Booking Approved!</h2>
                <p>Hello ${user.name || "there"},</p>
                <p>Great news! Your booking request for <strong>${
                  event.title
                }</strong> has been approved by the organizer.</p>
                <p>You can now view your ticket in the "My Bookings" section of the website.</p>
                <div style="margin: 20px 0; padding: 15px; background-color: #f8fafc; border-radius: 8px;">
                  <p style="margin: 0;"><strong>Event:</strong> ${
                    event.title
                  }</p>
                  <p style="margin: 5px 0 0 0;"><strong>Status:</strong> Confirmed</p>
                </div>
                <p>Enjoy the event!</p>
                <p>Best regards,<br/>The ECoNet Team</p>
              </div>
            `,
          });
        }
      } catch (emailErr) {
        console.error("Failed to send approval email:", emailErr);
      }
    } catch (error) {
      console.error("Failed to notify user:", error);
    }

    return NextResponse.json({ success: true, message: "Request approved" });
  } catch (error) {
    console.error("Error approving request:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
