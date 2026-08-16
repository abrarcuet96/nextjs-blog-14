import { verifyToken } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Post from "@/lib/models/Post";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.trim();
    const tag = searchParams.get("tag")?.trim().toLowerCase();

    const filter = { published: true };

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { body: { $regex: search, $options: "i" } },
      ];
    }

    if (tag) filter.tags = tag;

    await connectDB();
    const posts = await Post.find(filter)
      .populate("author", "name")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ posts });
  } catch (error) {
    console.error("GET /api/posts failed:", error);
    return NextResponse.json(
      { error: "We could not load the posts. Please try again." },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("nextjs-blog-14")?.value;
    const user = verifyToken(token);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { title, body, tags, published } = await request.json();

    if (!title || !body) {
      return NextResponse.json(
        { error: "Title and body are required" },
        { status: 400 },
      );
    }

    const post = await Post.create({
      title,
      body,
      tags: tags || [],
      published: published ?? true,
      author: user.id,
    });

    return NextResponse.json(post, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 },
    );
  }
}
