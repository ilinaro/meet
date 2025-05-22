import { AxiosResponse } from "axios";
import $api from "../http";
import { IUser, IContact } from "../models";

export default class UserService {
  static getUser(): Promise<AxiosResponse<IUser>> {
    return $api.get<IUser>("/user");
  }

  static async searchUsers(
    nickname: string,
  ): Promise<AxiosResponse<IContact[]>> {
    return $api.get<IContact[]>("/search-users", {
      params: { nickname },
    });
  }

  static async getUsersId(id?: string): Promise<AxiosResponse<IContact>> {
    return $api.get<IContact>(`/users/${id}`);
  }
}
