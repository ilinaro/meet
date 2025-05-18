class DtoService {
  _id: string;
  email: string;
  isActivated: boolean;
  nickname: string;
  allowChatInvites?: boolean;
  isInContacts?: boolean;
  isOnline?: boolean;
  lastSeen?: Date | null;

  constructor(user: {
    _id: string;
    email: string;
    isActivated: boolean;
    nickname: string;
    allowChatInvites: boolean;
    isInContacts?: boolean;
  }) {
    this._id = user._id;
    this.email = user.email;
    this.isActivated = user.isActivated;
    this.nickname = user.nickname;
    this.allowChatInvites = user.allowChatInvites;
    this.isInContacts = user.isInContacts ?? false;
  }
}

export default DtoService;
