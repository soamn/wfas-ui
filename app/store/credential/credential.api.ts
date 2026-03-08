import axios from "axios";
import { config } from "@/app/config/config";
import { CredentialType } from "./credential.types";
import toast from "react-hot-toast";

export const saveCredential = async (credential: CredentialType) => {
  try {
    const url = `${config.BACKEND_SERVER_URL}/api/credential/create`;
    const response = await axios({
      method: "POST",
      url,
      data: credential,
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });
    return response;
  } catch (error: any) {
    const message =
      error.response?.data?.error.message || "Failed to save credential";
    toast.error(message, {
      id: "credential-error",
      style: {
        borderRadius: "12px",
        background: "#333",
        color: "#fff",
      },
    });
  }
};

export const deleteCredential = async (
  credentialName: CredentialType["name"],
) => {
  try {
    const response = await axios({
      method: "DELETE",
      url: `${config.BACKEND_SERVER_URL}/api/credential/delete`,
      data: { name: credentialName },
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });
    return response;
  } catch (error: any) {
    const message =
      error.response?.data?.error.message || "Failed to delete credential";
    toast.error(message, {
      id: "credential-error",
      style: {
        borderRadius: "12px",
        background: "#333",
        color: "#fff",
      },
    });
  }
};

export const createWebhookCredential = async (credential: CredentialType) => {
  try {
    const response = await axios({
      method: "POST",
      url: `${config.BACKEND_SERVER_URL}/api/credential/webhook`,
      data: credential,
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });
    return response;
  } catch (error: any) {
    const message =
      error.response?.data?.error.message || "Failed to configure credential";
    toast.error(message, {
      id: "credential-error",
      style: {
        borderRadius: "12px",
        background: "#333",
        color: "#fff",
      },
    });
  }
};

export const verifyCredential = async (credential: CredentialType) => {
  try {
    const response = await axios({
      method: "POST",
      url: `${config.BACKEND_SERVER_URL}/api/credential/verify`,
      data: credential,
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
    return response?.data;
  } catch (error) {
    return false;
  }
};
