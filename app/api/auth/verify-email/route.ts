import { NextResponse } from "next/server";
import crypto from "crypto";
import User from "@/models/User";
import connectDb from "@/lib/connectDb";
import {
  generateAccessToken,
  generateRefreshToken,
  setTokenCookies,
} from "@/lib/auth";

export async function POST(req: Request) {
  try {
    await connectDb();
    const { email, code } = await req.json();

    if (!email || !code) {
      return NextResponse.json(
        { message: "Email and code are required" },
        { status: 400 }
      );
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
      verificationToken: code,
      verificationTokenExpire: { $gt: new Date() },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid or expired verification code" },
        { status: 400 }
      );
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpire = undefined;

    // Generate tokens
    const accessToken = generateAccessToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    const refreshToken = generateRefreshToken(user._id.toString());
    user.refreshToken = refreshToken;

    await user.save();
    await setTokenCookies(accessToken, refreshToken);

    return NextResponse.json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Error verifying email" },
      { status: 500 }
    );
  }
}
