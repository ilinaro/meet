import { Schema, model, Document, Types } from "mongoose";
import { IUser } from "../types/user"; // Импортируем IUser

export interface IContact extends Document {
  userId: Types.ObjectId;
  contactId: Types.ObjectId | IUser; // contactId может быть ObjectId или населённым IUser
}

const ContactSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    contactId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

ContactSchema.index({ userId: 1, contactId: 1 }, { unique: true });

export default model<IContact>("Contact", ContactSchema);