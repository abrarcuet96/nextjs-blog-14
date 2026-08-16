import { generateToken, setAuthCookie } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    await connectDB();
    const { name, email, password } = await request.json();
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 },
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 },
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    const existing = await User.findOne({ email: cleanEmail });
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name: name.trim(),
      email: cleanEmail,
      password: hashedPassword,
    });

    const token = generateToken({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    const response = NextResponse.json(
      {
        message: "User created successfully",
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 201 },
    );

    setAuthCookie(response, token);

    return response;
  } catch (error) {
    console.error("POST /api/auth/signup failed:", error);
    return NextResponse.json(
      { error: "An error occurred while creating the user" },
      { status: 500 },
    );
  }
}
