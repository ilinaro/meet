import { Schema, model, Document, Types } from "mongoose";
import { IUser } from "../types/user";

export interface IContact extends Document {
  userId: Types.ObjectId;
  nickname: string;
  contactId: Types.ObjectId | IUser;
  chatId: Types.ObjectId | null;
}

const ContactSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    contactId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    chatId: { type: Schema.Types.ObjectId, ref: "Chat" },
    nickname: { type: String, required: true },
  },
  { timestamps: true },
);

ContactSchema.index({ userId: 1, contactId: 1 }, { unique: true });

export default model<IContact>("Contact", ContactSchema);
