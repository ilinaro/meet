import { Document } from "mongoose";

export interface IUser extends Document {
  _id: string;
  email: string;
  password: string;
  isActivated: boolean;
  activationLink: string;
  nickname: string;
  allowChatInvites: boolean;
}