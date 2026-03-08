import type { MetadataRoute } from "next";
import { config } from "./config/config";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: config.DOMAIN,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${config.DOMAIN}/workflows`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
  ];
}
