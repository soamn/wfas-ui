import { SiDiscord, SiGooglesheets, SiSlack, SiTelegram } from "react-icons/si";
import { ProviderEnum } from "./credential.types";
import SlackConfig from "@/app/components/nodes/menus/ActionConfigs/SlackConfig";
import DiscordConfig from "@/app/components/nodes/menus/ActionConfigs/DiscordConfig";
import GoogleSheetsConfig from "@/app/components/nodes/menus/ActionConfigs/GoogleSheetsConfig";
import TelegramConfig from "@/app/components/nodes/menus/ActionConfigs/TelegramConfig";
import TelegramWebhookConfig from "@/app/components/nodes/menus/webhookConfigs/TelegramWebhookConfig";
import SlackWebhookConfig from "@/app/components/nodes/menus/webhookConfigs/SlackWebhookConfig";

export const ProviderMetadata: Partial<Record<ProviderEnum, any>> = {
  [ProviderEnum.Telegram]: {
    icon: SiTelegram,
    color: "#26A5E4",
    configComponent: TelegramConfig,
    webhookConfigComponent: TelegramWebhookConfig,
  },
  [ProviderEnum.Slack]: {
    icon: SiSlack,
    color: "#4A154B",
    configComponent: SlackConfig,
    webhookConfigComponent: SlackWebhookConfig,
  },
  [ProviderEnum.Discord]: {
    icon: SiDiscord,
    color: "#5966F2",
    configComponent: DiscordConfig,
  },
  [ProviderEnum.GoogleSheets]: {
    icon: SiGooglesheets,
    color: "#5966F2",
    configComponent: GoogleSheetsConfig,
  },
};
