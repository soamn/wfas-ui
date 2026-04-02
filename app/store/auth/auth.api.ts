import axios from "axios";
import { LoginType, RegisterType } from "./auth.types";
import { config } from "@/app/config/config";

const api = axios.create({
  baseURL: `${config.BACKEND_SERVER_URL}/api`,
  withCredentials: true,
});

export const getSession = async () => {
  return await api.get("/auth");
};

export const loginRequest = async (user: LoginType) => {
  return await api.post("/user/login", user);
};

export const registerRequest = async (user: RegisterType) => {
  return await api.post("/user/register", user);
};

export const logoutRequest = async () => {
  return await api.post("/user/logout");
};
