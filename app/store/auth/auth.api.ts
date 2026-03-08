import axios from "axios";
import { LoginType, RegisterType } from "./auth.types";
import { config } from "@/app/config/config";

export const getSession = async () => {
  return await axios.get(`${config.BACKEND_SERVER_URL}/api/auth`, {
    withCredentials: true,
  });
};

export const loginRequest = async (user: LoginType) => {
  return await axios({
    method: "POST",
    url: `${config.BACKEND_SERVER_URL}/api/user/login`,
    data: user,
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });
};

export const registerRequest = async (user: RegisterType) => {
  return await axios({
    method: "POST",
    url: `${config.BACKEND_SERVER_URL}/api/user/register`,
    data: user,
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });
};

export const logoutRequest = async (user: any) => {
  return await axios({
    method: "POST",
    url: `${config.BACKEND_SERVER_URL}/api/user/logout`,
    data: user,
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });
};
