import z from "zod";

export enum ProviderEnum {
  Discord = "Discord",
  Slack = "Slack",
  Telegram = "Telegram",
  GoogleSheets = "GoogleSheets",
  OpenRouter="OpenRouter",
}

export const CredentialSchema = z.object({
  id: z.string().optional(),
  name: z.enum(ProviderEnum),
  credential: z
    .object({
      key: z.string().min(1, "key is required"),
    })
    .loose(),
});

export type CredentialType = z.infer<typeof CredentialSchema>;
