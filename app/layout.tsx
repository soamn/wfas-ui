import type { Metadata } from "next";
import "./globals.css";
import { ReactFlowProvider } from "@xyflow/react";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "./provider/theme-provider";
import { SessionProvider } from "./provider/session-provider";
import { config } from "./config/config";

export const metadata: Metadata = {
  title: {
    default: "WFAS - Workflow Automation System",
    template: "%s | WFAS",
  },
  metadataBase: new URL(process.env.DOMAIN || "http://localhost:3000"),
  description:
    "WFAS is a powerful workflow automation platform for building, executing, and managing automated workflows.",

  applicationName: "WFAS",

  keywords: [
    "workflow automation",
    "automation system",
    "workflow engine",
    "task automation",
    "workflow builder",
  ],

  authors: [{ name: "soamn" }],

  creator: "WFAS",
  publisher: "WFAS",

  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },

  openGraph: {
    title: "WFAS - Workflow Automation System",
    description: "Build and automate workflows easily with WFAS.",
    url: config.DOMAIN,
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
      },
    ],
    siteName: "WFAS",
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "WFAS - Workflow Automation System",
    description: "Build and automate workflows easily with WFAS.",
    images: ["/opengraph-image.png"],
  },

  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased bg-white dark:bg-zinc-900 dark:text-white`}>
        <ThemeProvider>
          <SessionProvider>
            <ReactFlowProvider>{children}</ReactFlowProvider>
            <Toaster position="top-center" />
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
