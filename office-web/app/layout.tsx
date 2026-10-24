import "./globals.css";
import React from "react";
import { UserProvider } from "./contexts/UserContext";
import { ServiceWorker } from "./components/Pwa/ServiceWorker";

export const metadata = {
  title: "Office",
  description: "Office Web",
  // viewport-fit=cover lets the layout reach under the notch / home bar;
  // padding with env(safe-area-inset-*) keeps content clear of them
  viewport: {
    width: "device-width",
    initialScale: 1,
    viewportFit: "cover",
  },
  themeColor: "#3b82f6",
  // Files in public/: Turbopack (next dev --turbo) ignores app/manifest.*
  // and app/icon.* file conventions, and app/favicon.ico would hide these
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: "/icons/apple-touch-icon.png",
  },
  // Installed on iPhone/iPad from "Adicionar à Tela de Início"
  appleWebApp: {
    capable: true,
    title: ".office",
    statusBarStyle: "default",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserProvider>
      <html lang="pt-BR">
        <body>
          {children}
          <ServiceWorker />
        </body>
      </html>
    </UserProvider>
  );
}
