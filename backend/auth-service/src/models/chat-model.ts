import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema({
  participants: [{ type: String, ref: "User", required: true }],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Chat", ChatSchema);