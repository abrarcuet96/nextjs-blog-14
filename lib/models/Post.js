import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    body: { type: String, required: true, maxlength: 20_000 },
    tags: [{ type: String, trim: true, lowercase: true, maxlength: 30 }],
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
