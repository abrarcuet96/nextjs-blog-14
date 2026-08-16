import { AUTH_COOKIE, verifyToken } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const session = verifyToken(cookieStore.get(AUTH_COOKIE)?.value);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const user = await User.findById(session.id).select("name email role").lean();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      user: { ...user, id: user._id.toString(), _id: undefined },
    });
  } catch (error) {
    console.error("GET /api/auth/me failed:", error);
    return NextResponse.json(
      { error: "We could not load your account." },
      { status: 500 },
    );
  }
}
