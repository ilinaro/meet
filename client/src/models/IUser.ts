export interface IUser {
  readonly _id: string;
  email: string;
  isActivated: boolean;
  nickname: string;
  allowChatInvites: boolean;
  isInContacts?: boolean;
  isOnline?: boolean;
  lastSeen?: string | null;
  lastMessages?: unknown;
}
