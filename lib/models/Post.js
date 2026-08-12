import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    body: { type: String, required: true },
    tags: [{ type: String, trim: true, lowercase: true }],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    published: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export default mongoose.models.Post || mongoose.model("Post", postSchema);
