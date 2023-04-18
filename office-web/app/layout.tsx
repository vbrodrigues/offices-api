import "./globals.css";
import React from "react";
import { UserProvider } from "./contexts/UserContext";

export const metadata = {
  title: "Office",
  description: "Office Web",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </UserProvider>
  );
}
