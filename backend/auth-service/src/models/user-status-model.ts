import mongoose from "mongoose";

const UserStatusSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  isOnline: { type: Boolean, default: false },
  lastSeen: { type: Date, default: null },
});

export default mongoose.model("UserStatus", UserStatusSchema);