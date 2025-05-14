import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  chatId: { type: String, required: true },
  sender: { type: String, ref: "User", required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  readBy: [{ type: String, ref: "User" }],
});
export default mongoose.model("Message", MessageSchema);
