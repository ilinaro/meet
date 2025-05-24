import axios, { AxiosResponse } from "axios";
import $api, { API_URL } from "../http";
import { AuthResponse, LoginData, RegisterData } from "../models";

export default class AuthService {
  static async login(req: LoginData): Promise<AxiosResponse<AuthResponse>> {
    return $api.post<AuthResponse>("/login", req);
  }
  static async registration(
    req: RegisterData
  ): Promise<AxiosResponse<AuthResponse>> {
    return $api.post<AuthResponse>("/registration", req);
  }
  static async logout(): Promise<void> {
    return $api.post("/logout");
  }
  
  static async checkAuth() {
    const data = await axios.get<AuthResponse>(`${API_URL}/refresh`, {
      withCredentials: true,
    });

    return data;
  }
}
