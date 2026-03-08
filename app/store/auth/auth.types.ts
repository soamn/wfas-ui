import z from "zod";
import { CredentialType } from "../credential/credential.types";

export const loginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(2, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  name: z.string().max(20, "Name can't be longer than 20 characters"),
  email: z.email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .regex(/[A-Z]/, "Password must contain at least one capital letter")
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character",
    ),
});
const authSchema = registerSchema.extend({
  credentials: z.array(z.any()),
});

export type LoginType = z.infer<typeof loginSchema>;
export type RegisterType = z.infer<typeof registerSchema>;
export type AuthState = z.infer<typeof authSchema>;

export interface AuthStoreState {
  user: AuthState | null;
}

export interface AuthActions {
  storeAuthData: (user: AuthState) => void;
  deleteAuthData: () => void;
  fetchUser: () => void;
  updateUserCredentials: (credentials: CredentialType[]) => void;
}
