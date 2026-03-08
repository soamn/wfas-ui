type Config = {
  BACKEND_SERVER_URL: string;
  DISCORD_BOT_URL: string;
  DOMAIN: string;
};

export const config: Config = {
  BACKEND_SERVER_URL: process.env.NEXT_PUBLIC_BACKEND_URL!,
  DISCORD_BOT_URL: process.env.NEXT_PUBLIC_DISCORD_URL!,
  DOMAIN: process.env.NEXT_PUBLIC_DOMAIN!,
};
