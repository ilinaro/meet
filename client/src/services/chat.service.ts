import { AxiosResponse } from "axios";
import $api from "../http";
import { AuthResponse, IUser } from "../models";

export default class ChatService {
  static async startChat(
    targetUserId: string,
  ): Promise<AxiosResponse<{ chatId: string }>> {
    return $api.post("/chat/start", { targetUserId });
  }

  static async add(req: { id: string }): Promise<AxiosResponse<AuthResponse>> {
    return $api.post<AuthResponse>("/chat/add-contact", req);
  }

  static async contacts(): Promise<AxiosResponse<IUser[]>> {
    return $api.get<IUser[]>("/chat/contacts");
  }

  static async deleteChat(id: string) {
    return $api.delete(`/chat/remove-contact/${id}`);
  }
}
