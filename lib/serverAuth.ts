import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "./auth";
import User from "@/models/User";
import connectDb from "./connectDb";
import { AuthenticatedUser } from "@/types/auth";

/**
 * Get the currently authenticated user from HTTP-only cookies
 * Returns null if not authenticated
 */
export async function getCurrentUser(): Promise<AuthenticatedUser | null> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) {
      return null;
    }

    // Verify token
    const decoded = verifyToken(accessToken, "access");

    if (
      !decoded ||
      !("userId" in decoded) ||
      !("email" in decoded) ||
      !("role" in decoded)
    ) {
      return null;
    }

    try {
      // Fetch user from database to get name
      await connectDb();
      const user = await User.findById(decoded.userId).lean();

      if (!user) {
        return null;
      }

      return {
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role as "user" | "organizer",
        name: user.name,
      };
    } catch (dbError) {
      console.error("Database connection failed in serverAuth:", dbError);
      return null;
    }
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}

/**
 * Require authentication - throws error if not authenticated
 */
export async function requireAuth(): Promise<AuthenticatedUser> {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}

/**
 * Require organizer role - throws error if not authenticated or not an organizer
 */
export async function requireOrganizer(): Promise<AuthenticatedUser> {
  const user = await requireAuth();

  if (user.role !== "organizer") {
    throw new Error(
      "Organizer access required. Only organizers can perform this action."
    );
  }

  return user;
}
