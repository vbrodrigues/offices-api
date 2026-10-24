import "./globals.css";
import React from "react";
import { UserProvider } from "./contexts/UserContext";

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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserProvider>
      <html lang="pt-BR">
        <body>{children}</body>
      </html>
    </UserProvider>
  );
}
