import { Geist, Geist_Mono } from "next/font/google";
import type { Metadata, Viewport } from "next";

import "@workspace/ui/globals.css";
import { Providers } from "@/components/providers";
import { QueryProvider } from "@/components/query-provider";
import { ServiceWorkerRegistration } from "@/components/service-worker";

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Budgeting App",
  description: "A modern budgeting application",
  generator: "Next.js",
  manifest: "/manifest.json",
  keywords: ["budgeting", "finance", "money", "tracker"],
  authors: [{ name: "Budgeting Team" }],
  icons: [
    { rel: "apple-touch-icon", url: "/icon-192.svg" },
    { rel: "icon", url: "/icon-192.svg" },
  ],
};

export const viewport: Viewport = {
  minimumScale: 1,
  initialScale: 1,
  width: "device-width",
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased `}
      >
        <Providers>
          <QueryProvider>{children}</QueryProvider>
        </Providers>
        <ServiceWorkerRegistration />
      </body>
    </html>
  );
}
