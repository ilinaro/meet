import UserModel from "../models/user-model";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { ErrorMessages } from "../utils/text-message";
import MailService from "./mail-service";
import TokenService from "./token-service";
import DtoService from "./dto-service";
import ApiError from "../exceptions/api-error";
import ContactModel from "../models/contact-model";
import UserStatusModel from "../models/user-status-model";
import mongoose from "mongoose";

interface User {
  _id: string | { toString(): string };
  email: string;
  isActivated: boolean;
  nickname: string;
  allowChatInvites: boolean;
}

class UserService {
  private createUserDto(
    user: User,
    currentUserId?: string,
    status?: { isOnline: boolean; lastSeen: Date | null },
  ): DtoService {
    const userDtoObject = {
      _id: user._id.toString(),
      email: user.email,
      isActivated: user.isActivated,
      nickname: user.nickname,
      allowChatInvites: user.allowChatInvites,
      isInContacts: false,
    };
    const userDto = new DtoService(userDtoObject);
    Object.assign(userDto, {
      isOnline: status ? status.isOnline : false,
      lastSeen: status && !status.isOnline ? status.lastSeen : null,
    });
    return userDto;
  }

  async getUserStatuses(
    userIds: string[],
  ): Promise<{ [key: string]: { isOnline: boolean; lastSeen: Date | null } }> {
    const statuses = await UserStatusModel.find({
      userId: { $in: userIds },
    }).select("userId isOnline lastSeen");
    const statusMap: {
      [key: string]: { isOnline: boolean; lastSeen: Date | null };
    } = {};
    userIds.forEach((id) => {
      const status = statuses.find((s) => s.userId === id);
      statusMap[id] = {
        isOnline: status ? status.isOnline : false,
        lastSeen: status && !status.isOnline ? status.lastSeen : null,
      };
    });
    return statusMap;
  }

  async registration(email: string, password: string, nickname: string) {
    const candidate = await UserModel.findOne({ email });
    if (candidate) {
      throw ApiError.BadRequest(ErrorMessages.EMAIL_EXISTS);
    }

    const nicknameExists = await UserModel.findOne({ nickname });
    if (nicknameExists) {
      throw ApiError.BadRequest("Никнейм уже занят");
    }

    const hashPassword = await bcrypt.hash(password, 3);
    const activationLink = uuidv4();

    const user = await UserModel.create({
      email,
      password: hashPassword,
      nickname,
      activationLink,
    });

    await MailService.sendActivationMail(
      email,
      `${process.env.API_URL}/api/active/${activationLink}`,
    );
    const userDto = this.createUserDto(user);
    const tokens = TokenService.generateTokens({ ...userDto });
    await TokenService.saveToken(userDto._id, tokens.refreshToken);
    return { ...tokens, user: userDto };
  }

  async active(activationLink: string) {
    const user = await UserModel.findOne({ activationLink });

    if (!user) {
      throw ApiError.BadRequest(ErrorMessages.NOT_CORRECT_LINK);
    }
    user.isActivated = true;
    await user.save();
  }

  async login(email: string, password: string) {
    const user = await UserModel.findOne({ email });

    if (!user) {
      throw ApiError.BadRequest(ErrorMessages.USER_NOT_FOUND);
    }

    const isPassEquals = await bcrypt.compare(password, user.password);
    if (!isPassEquals) {
      throw ApiError.BadRequest(ErrorMessages.WRONG_PASS_OR_EMAIL);
    }

    const userDto = this.createUserDto(user);
    const tokens = TokenService.generateTokens({ ...userDto });
    await TokenService.saveToken(userDto._id, tokens.refreshToken);
    return { ...tokens };
  }

  async logout(refreshToken: string) {
    const token = TokenService.removeToken(refreshToken);
    return token;
  }

  async refresh(refreshToken: string) {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError();
    }
    const userData = TokenService.validateRefreshToken(refreshToken);
    const tokenFromDb = await TokenService.findToken(refreshToken);
    if (!userData || !tokenFromDb) {
      throw ApiError.UnauthorizedError();
    }
    const user = await UserModel.findById((userData as DtoService)._id);

    if (!user) {
      throw ApiError.UnauthorizedError();
    }

    const userDto = this.createUserDto(user);
    const tokens = TokenService.generateTokens({ ...userDto });
    await TokenService.saveToken(userDto._id, tokens.refreshToken);
    return { ...tokens };
  }

  async getAllUsers() {
    const users = await UserModel.find();
    const userIds = users.map((user) => user._id.toString());
    const statuses = await this.getUserStatuses(userIds);
    return users.map((user) =>
      this.createUserDto(user, undefined, statuses[user._id.toString()]),
    );
  }

  async searchUsers(nickname: string, currentUserId?: string) {
    const limit = 50;

    const query = {
      nickname: { $regex: nickname, $options: "i" },
      ...(currentUserId
        ? { _id: { $ne: new mongoose.Types.ObjectId(currentUserId) } }
        : {}),
    };

    const [users, contacts] = await Promise.all([
      UserModel.find(query).select("nickname _id").limit(limit),

      currentUserId
        ? ContactModel.find({ userId: currentUserId }).select("contactId")
        : Promise.resolve([]),
    ]);

    if (contacts.length === 0) {
      return users.map((user) => ({
        _id: user._id,
        nickname: user.nickname,
        isInContacts: false,
        chatId: null,
      }));
    }

    const contactIdsSet = new Set(
      contacts.map((contact) => contact.contactId.toString()),
    );

    return users.map((user) => {
      const userId = user._id.toString();
      return {
        _id: user._id,
        nickname: user.nickname,
        isInContacts: contactIdsSet.has(userId),
        chatId: null,
      };
    });
  }

  async updateUser(
    userId: string,
    updates: { nickname?: string; allowChatInvites?: boolean },
  ) {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw ApiError.BadRequest(ErrorMessages.USER_NOT_FOUND);
    }

    if (updates.nickname) {
      const nicknameExists = await UserModel.findOne({
        nickname: updates.nickname,
      });
      if (nicknameExists && nicknameExists._id.toString() !== userId) {
        throw ApiError.BadRequest("Никнейм уже занят");
      }
      user.nickname = updates.nickname;
    }

    if (typeof updates.allowChatInvites === "boolean") {
      user.allowChatInvites = updates.allowChatInvites;
    }

    await user.save();
    const statuses = await this.getUserStatuses([userId]);
    const userDto = this.createUserDto(user, undefined, statuses[userId]);
    return userDto;
  }

  async getUserById(userId: string) {
    const user = await UserModel.findById(userId);
    if (!user) {
      return null;
    }
    const statuses = await this.getUserStatuses([userId]);
    const userDto = this.createUserDto(user, undefined, statuses[userId]);
    return userDto;
  }
}

export default new UserService();
