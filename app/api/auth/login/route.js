import { generateToken } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    await connectDB();
    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 },
      );
    }

    const existing = await User.findOne({ email });

    if (!existing) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 400 },
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
      { message: "Login successful", user: existing },
      { status: 200 },
    );

    response.cookies.set("nextjs-blog-14", token, {
      httpOnly: true,
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "An error occurred while logging in" },
      { status: 500 },
    );
  }
}
