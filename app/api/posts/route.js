import { AUTH_COOKIE, verifyToken } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Post from "@/lib/models/Post";
import { escapeRegex, normalizeTags } from "@/lib/post-utils.mjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.trim();
    const tag = searchParams.get("tag")?.trim().toLowerCase();
    const mine = searchParams.get("mine") === "true";

    const filter = {};

    if (mine) {
      const cookieStore = await cookies();
      const user = verifyToken(cookieStore.get(AUTH_COOKIE)?.value);
      if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      filter.author = user.id;
    } else {
      filter.published = true;
    }

    if (search) {
      const safeSearch = escapeRegex(search);
      filter.$or = [
        { title: { $regex: safeSearch, $options: "i" } },
        { body: { $regex: safeSearch, $options: "i" } },
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
    const token = cookieStore.get(AUTH_COOKIE)?.value;
    const user = verifyToken(token);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { title, body, tags, published } = await request.json();

    if (
      typeof title !== "string" ||
      typeof body !== "string" ||
      !title.trim() ||
      !body.trim()
    ) {
      return NextResponse.json(
        { error: "Title and body are required" },
        { status: 400 },
      );
    }

    const post = await Post.create({
      title: title.trim(),
      body: body.trim(),
      tags: normalizeTags(tags),
      published: typeof published === "boolean" ? published : true,
      author: user.id,
    });

    return NextResponse.json({ post }, { status: 201 });
  } catch (err) {
    console.error("POST /api/posts failed:", err);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 },
    );
  }
}
