import { Geist, Geist_Mono } from "next/font/google";
import type { Metadata, Viewport } from "next";

import "@workspace/ui/globals.css";
import { Providers } from "@/components/providers";
import { QueryProvider } from "@/components/query-provider";
import { ServiceWorkerRegistration } from "@/components/service-worker";
import Script from "next/script";

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
        {/* Initial splash screen - visible before hydration */}
        <div
          id="app-splash"
          role="status"
          aria-live="polite"
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-white dark:bg-black transition-opacity duration-500"
        >
          <div className="flex items-center gap-3">
            <img
              src="/icon-192.svg"
              alt="Budgeting"
              className="h-8 w-8 dark:invert-0"
            />
            <span className="text-xl font-semibold text-gray-900 dark:text-white">
              Budgeting
            </span>
            <span className="relative ml-4 inline-flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
          </div>
        </div>
        <Providers>
          <QueryProvider>{children}</QueryProvider>
        </Providers>
        <ServiceWorkerRegistration />
        <Script id="hide-splash" strategy="afterInteractive">
          {`
            (function(){
              var hide = function(){
                var el = document.getElementById('app-splash');
                if(!el) return;
                el.classList.add('opacity-0','pointer-events-none');
                setTimeout(function(){
                  if(el && el.parentElement){ el.parentElement.removeChild(el); }
                }, 550);
              };
              if (document.readyState === 'complete' || document.readyState === 'interactive') {
                setTimeout(hide, 150);
              } else {
                window.addEventListener('DOMContentLoaded', function(){ setTimeout(hide, 150); }, { once: true });
              }
            })();
          `}
        </Script>
      </body>
    </html>
  );
}
