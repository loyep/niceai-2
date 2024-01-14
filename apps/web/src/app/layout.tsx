import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";

import "@arco-themes/react-niceai/css/arco.css";

import { auth } from "@niceai/auth";
import { SessionProvider } from "@niceai/auth/react";
import { cn } from "../components/utils";

import { env } from "~/env";
import { ArcoThemeProvider, ThemeProvider } from "./theme-provider";

import "~/app/globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    env.VERCEL_ENV === "production"
      ? "https://niceai.dev"
      : "http://localhost:3000",
  ),
  title: "Nice AI",
  description: "Nice AI",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default async function RootLayout(props: { children: React.ReactNode }) {
  const session = await auth();
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={cn(
          "min-h-screen font-sans antialiased",
          GeistSans.variable,
          GeistMono.variable,
        )}
      >
        <SessionProvider session={session}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ArcoThemeProvider>
              {props.children}
              {/* <div className="absolute bottom-4 right-4">
                <ThemeToggle />
              </div> */}
            </ArcoThemeProvider>
          </ThemeProvider>
        </SessionProvider>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
