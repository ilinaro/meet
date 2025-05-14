import { Schema, model } from "mongoose";

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isActivated: { type: Boolean, default: false },
  activationLink: { type: String },
  nickname: { type: String, required: true, unique: true },
  allowChatInvites: { type: Boolean, default: true },
});

export default model("User", UserSchema);
