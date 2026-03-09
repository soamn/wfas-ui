import axios from "axios";
import { CredentialType } from "./credential.types";
import toast from "react-hot-toast";

const api = axios.create({
  baseURL: "/api/credential",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

const handleApiError = (error: any, defaultMsg: string) => {
  const message = error.response?.data?.error?.message || defaultMsg;
  toast.error(message, {
    id: "credential-error",
    style: { borderRadius: "12px", background: "#333", color: "#fff" },
  });
};

export const saveCredential = async (credential: CredentialType) => {
  try {
    return await api.post("/create", credential);
  } catch (error: any) {
    handleApiError(error, "Failed to save credential");
  }
};

export const deleteCredential = async (
  credentialName: CredentialType["name"],
) => {
  try {
    return await api.delete("/delete", { data: { name: credentialName } });
  } catch (error: any) {
    handleApiError(error, "Failed to delete credential");
  }
};

export const createWebhookCredential = async (credential: CredentialType) => {
  try {
    return await api.post("/webhook", credential);
  } catch (error: any) {
    handleApiError(error, "Failed to configure credential");
  }
};

export const verifyCredential = async (credential: CredentialType) => {
  try {
    const response = await api.post("/verify", credential);
    return response?.data;
  } catch (error) {
    return false;
  }
};
