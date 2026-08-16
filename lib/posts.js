import mongoose from "mongoose";
import { cache } from "react";
import { connectDB } from "./db";
import Post from "./models/Post";

function serializePost(post) {
  return JSON.parse(JSON.stringify(post));
}

export const getPublicPost = cache(async function getPublicPost(id) {
  if (!mongoose.isValidObjectId(id)) return null;
  await connectDB();
  const post = await Post.findOne({ _id: id, published: true })
    .populate("author", "name")
    .lean();
  return post ? serializePost(post) : null;
});

export const getVisiblePost = cache(async function getVisiblePost(id, userId) {
  if (!mongoose.isValidObjectId(id)) return null;
  const visibility = userId
    ? { $or: [{ published: true }, { author: userId }] }
    : { published: true };
  await connectDB();
  const post = await Post.findOne({ _id: id, ...visibility })
    .populate("author", "name")
    .lean();
  return post ? serializePost(post) : null;
});

export async function getPublishedPostLinks() {
  await connectDB();
  return Post.find({ published: true }).select("_id updatedAt").lean();
}
