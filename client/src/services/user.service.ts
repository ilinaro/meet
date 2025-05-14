import { AxiosResponse } from "axios";
import $api from "../http";
import { IUser } from "../models";

export default class UserService {
  static getUser(): Promise<AxiosResponse<IUser>> {
    return $api.get<IUser>("/user");
  }

  static async searchUsers(nickname: string): Promise<AxiosResponse<IUser[]>> {
    return $api.get<IUser[]>("/search-users", {
      params: { nickname },
    });
  }

  static async getUsersId(id?: string): Promise<AxiosResponse<IUser>> {
    return $api.get<IUser>(`/users/${id}`);
  }
}
