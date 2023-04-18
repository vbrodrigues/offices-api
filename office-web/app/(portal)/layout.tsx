"use client";

import { Header } from "@/app/components/Header";
import { Sidebar } from "@/app/components/Sidebar/Sidebar";
import React from "react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="flex flex-col h-[100vh] w-[100vw]">
      <Header />

      <main className="flex m-10 justify-center">
        <Sidebar />

        <div className="flex-1">{children}</div>
      </main>
    </div>
  );
};

export default DashboardLayout;
