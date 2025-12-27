import connectDb from "@/lib/connectDb";
import Notification from "@/models/Notification";

export const createNotification = async (data: {
  recipient: string;
  sender?: string;
  type:
    | "LOGIN"
    | "RESERVATION"
    | "CANCELLATION"
    | "NEW_FOLLOWER"
    | "NEW_EVENT_FROM_FOLLOWING"
    | "FEEDBACK_SUBMISSION";
  message: string;
  relatedEntityId?: string;
  relatedEntityType?: "Event" | "User";
}) => {
  try {
    await connectDb();
    const notification = await Notification.create(data);

    // Socket.io emit
    const io = (global as any).io;
    if (io) {
      io.to(`user:${data.recipient}`).emit("new-notification", notification);
    }
  } catch (error) {
    console.error("Failed to create notification inside lib:", error);
    console.error(
      "Notification Data causing error:",
      JSON.stringify(data, null, 2)
    );
  }
};
