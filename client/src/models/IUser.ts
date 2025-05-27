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
  chatId?: string | null;
}

export interface IContact {
  readonly chatId: string | null;
  readonly isInContacts: boolean;
  readonly nickname: string;
  readonly _id: string;
}

export interface MessageData {
  senderId: string;
  content: string;
  timestamp: string;
  chatId?: string;
}

export interface ContactData {
  senderId: string;
  chatId: string;
  timestamp: string;
}
