import { AUTH_COOKIE, verifyToken } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Post from "@/lib/models/Post";
import { normalizeTags } from "@/lib/post-utils.mjs";
import mongoose from "mongoose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

function invalidIdResponse() {
  return NextResponse.json({ error: "Invalid post id" }, { status: 400 });
}

async function getUser() {
  const cookieStore = await cookies();
  return verifyToken(cookieStore.get(AUTH_COOKIE)?.value);
}

export async function GET(_request, { params }) {
  try {
    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) return invalidIdResponse();

    const user = await getUser();
    const visibility = user
      ? { $or: [{ published: true }, { author: user.id }] }
      : { published: true };

    await connectDB();
    const post = await Post.findOne({ _id: id, ...visibility })
      .populate("author", "name")
      .lean();

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({ post });
  } catch (error) {
    console.error("GET /api/posts/[id] failed:", error);
    return NextResponse.json(
      { error: "We could not load this post. Please try again." },
      { status: 500 },
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) return invalidIdResponse();

    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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

    await connectDB();
    const post = await Post.findOneAndUpdate(
      { _id: id, author: user.id },
      {
        title: title.trim(),
        body: body.trim(),
        tags: normalizeTags(tags),
        published: typeof published === "boolean" ? published : true,
      },
      { new: true, runValidators: true },
    );

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({ post });
  } catch (error) {
    console.error("PUT /api/posts/[id] failed:", error);
    return NextResponse.json(
      { error: "We could not update the post. Please try again." },
      { status: 500 },
    );
  }
}

export async function DELETE(_request, { params }) {
  try {
    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) return invalidIdResponse();

    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const post = await Post.findOneAndDelete({ _id: id, author: user.id });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Post deleted" });
  } catch (error) {
    console.error("DELETE /api/posts/[id] failed:", error);
    return NextResponse.json(
      { error: "We could not delete the post. Please try again." },
      { status: 500 },
    );
  }
}
