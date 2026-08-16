import { generateToken, setAuthCookie } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    await connectDB();
    const { email, password } = await request.json();
    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      !password
    ) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 },
      );
    }

    const existing = await User.findOne({
      email: email.trim().toLowerCase(),
    }).select("+password");

    if (!existing) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 },
      );
    }

    const isMatch = await bcrypt.compare(password, existing.password);

    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    }

    const token = generateToken({
      id: existing._id.toString(),
      email: existing.email,
      role: existing.role,
    });

    const response = NextResponse.json(
      {
        message: "Login successful",
        user: {
          id: existing._id.toString(),
          name: existing.name,
          email: existing.email,
          role: existing.role,
        },
      },
      { status: 200 },
    );

    setAuthCookie(response, token);

    return response;
  } catch (error) {
    console.error("POST /api/auth/login failed:", error);
    return NextResponse.json(
      { error: "An error occurred while logging in" },
      { status: 500 },
    );
  }
}
